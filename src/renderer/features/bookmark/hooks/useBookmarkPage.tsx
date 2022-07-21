import { worldBookmarksState } from '@src/renderer/data/bookmarks';
import { worldDataState } from '@src/renderer/data/world';
import copyDeep from '@src/renderer/utils/copyDeep';
import getSheetWorldData from '@src/renderer/utils/getSheetWorldData';
import {
  loadBookmarkFromFileDialog,
  saveBookmarkToFileDialog,
} from '@src/renderer/utils/ipc/bookmarksUtils';
import {
  modifyEditSheetToMain,
  reomoveEditSheetToMain,
} from '@src/renderer/utils/ipc/editSheetToMain';
import openExternalLink from '@src/renderer/utils/ipc/openExternalLink';
import { WorldData, World, Bookmarks, WorldEditInput } from '@src/types';
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const SEARCH_OPTIONS = ['NAME', 'AUTHOR', 'DESCRIPTION', 'TAG'] as const;
export type SearchOptions = typeof SEARCH_OPTIONS;

interface HookMember {
  currentType: string;
  typeList: string[];
  worldData: WorldData;
  searchOptions: SearchOptions;
  infoModalWorld: World | undefined;
  bookmarkModalData: Bookmarks | undefined;
  isLoading: boolean;
  isManipulatedTable: boolean;

  onChangeType: (tabKey: string) => void;
  // onClickFavorite: (world: World) => void;
  onSearchWorlds: (text: string) => void;
  onChangeSearchOption: (option: SearchOptions[number]) => void;
  onClickToggleInfoModal: (world?: World) => void;
  onClickOpenTypeModal(): void;
  onCloseTypeModal(): void;
  onClickOpenSaveBookmarkDialog(): void;
  onClickOpenLoadBookmarkDialog(): void;
  onClickRefresh: () => void;
  onChangeIsManipulatedTable: (isManipulated: boolean) => void;
  onEditWorld: (key: string, world: WorldEditInput) => void;
  onRemoveWorld: (key: string) => void;
}
const useBookmarkPage = (): HookMember => {
  const [bookmarks, setFavorites] = useRecoilState(worldBookmarksState);
  const [worldData, setWorldData] = useRecoilState(worldDataState);
  const [isLoading, setIsLoading] = useState(worldData === undefined);
  const [currentType, setCurrentType] = useState<string>();
  const [curSearchText, setCurSearchText] = useState<string>();
  const [curSearchOption, setSearchOption] =
    useState<SearchOptions[number]>('NAME');
  const [modalWorldInfo, setModalWorldInfo] = useState<World | undefined>();
  const [visibleModalBookmark, setVisibleModalBookmark] =
    useState<boolean>(false);
  const [isManipulatedTable, setIsManipulatedTable] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const bookmarks = useMemo(() => favorites, [worldData]);

  useEffect(() => {
    if (!bookmarks) return;
    if (
      !currentType ||
      !Object.keys(bookmarks).find((e) => e === currentType)
    ) {
      setCurrentType(Object.keys(bookmarks)[0]);
    }
  }, [bookmarks, currentType]);

  // useEffect(() => {
  //   if (!currentType && bookmarks && Object.keys(bookmarks).length > 0) {
  //     setCurrentType(Object.keys(bookmarks)[0]);
  //   }
  // }, [currentType, bookmarks]);

  useEffect(() => {
    if (worldData === undefined) {
      getSheetWorldData().then((data) => {
        setIsLoading(false);
        return setWorldData(data);
      });
    }
  }, [setWorldData, worldData]);

  const favKeys = useMemo(
    () =>
      bookmarks && currentType && bookmarks[currentType]
        ? bookmarks[currentType]
        : [],
    [currentType, bookmarks],
  );
  const worldTableData = useMemo(() => {
    const orderedFavWorlds = favKeys
      .map((e) => worldData?.find((w) => w.key === e))
      .filter((e) => !!e) as World[];

    // const favWorlds = (
    //   worldData?.filter((w) =>
    //     favKeys.find((e) => e === w.key) ? true : false,
    //   ) || []
    // )
    //   .concat()
    //   .reverse();
    // return favWorlds;
    return orderedFavWorlds;
  }, [favKeys, worldData]);

  return {
    currentType: currentType || '',
    typeList: bookmarks ? Object.keys(bookmarks) : [],
    worldData: worldTableData,
    searchOptions: SEARCH_OPTIONS,
    infoModalWorld: modalWorldInfo,
    bookmarkModalData: visibleModalBookmark ? bookmarks : undefined,
    isLoading,
    isManipulatedTable,

    onChangeType(tabKey) {
      setCurrentType(tabKey);
    },
    // onClickFavorite(world) {
    //   if (!favorites) {
    //     message.loading('Favorite 불러오는 중');
    //     return;
    //   }
    //   setFavorites((v) => {
    //     const val = copyDeep(v)!;
    //     if (val.favorite1.find((e) => e === world.key)) {
    //       val.favorite1 = val.favorite1.filter((e) => e !== world.key);
    //       return val;
    //     }
    //     val.favorite1.push(world.key);
    //     return val;
    //   });
    // },
    onClickToggleInfoModal(w) {
      setModalWorldInfo(w);
    },
    onClickRefresh() {
      setIsLoading(true);
      getSheetWorldData().then((data) => {
        setIsLoading(false);
        return setWorldData(data);
      });
    },
    onClickOpenTypeModal() {
      setVisibleModalBookmark(true);
    },
    onCloseTypeModal() {
      setVisibleModalBookmark(false);
    },

    onClickOpenLoadBookmarkDialog() {
      loadBookmarkFromFileDialog().catch((e: Error) => message.warn('취소됨.'));
    },
    onClickOpenSaveBookmarkDialog() {
      if (bookmarks) {
        saveBookmarkToFileDialog(bookmarks).catch((e: Error) =>
          message.warn('취소됨.'),
        );
      }
    },

    onChangeSearchOption(option) {},
    onSearchWorlds(text) {},
    onChangeIsManipulatedTable(isManipulated) {
      setIsManipulatedTable(isManipulated);
    },
    onEditWorld(key, world) {
      setIsLoading(true);
      modifyEditSheetToMain(key, world)
        .then(() => {
          message.info('월드가 변경되었습니다');
        })
        .then(() => {
          getSheetWorldData().then((data) => {
            setWorldData(data);
          });
        })
        .catch((e: Error) => message.error(e.toString()))
        .finally(() => setIsLoading(false));
    },
    onRemoveWorld(key) {
      setIsLoading(true);
      reomoveEditSheetToMain(key)
        .then(() => {
          message.info('월드가 삭제되었습니다');
        })
        .then(() => {
          getSheetWorldData().then((data) => {
            setWorldData(data);
          });
        })
        .catch((e: Error) => message.error(e.toString()))
        .finally(() => setIsLoading(false));
    },

    // checkIsFavorite(world) {
    //   if (favorites?.favorite1) {
    //     return favorites.favorite1.find((e) => e === world.key) ? true : false;
    //   }
    //   return false;
    // },
  };
};

export default useBookmarkPage;
