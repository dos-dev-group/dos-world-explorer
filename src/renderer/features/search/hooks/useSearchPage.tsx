/* eslint-disable promise/no-nesting */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { worldFavoritesState } from '@src/renderer/data/favorites';
import { searchTextState, worldDataState } from '@src/renderer/data/world';
import getSheetWorldData from '@src/renderer/utils/getSheetWorldData';
import {
  addEditSheetToMain,
  getWorldDataToMain,
  modifyEditSheetToMain,
  reomoveEditSheetToMain,
} from '@src/renderer/utils/ipc/editSheetToMain';
import openExternalLink from '@src/renderer/utils/ipc/openExternalLink';
import { World, WorldEditInput } from '@src/types';
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

const SEARCH_OPTIONS = ['NAME', 'AUTHOR', 'DESCRIPTION', 'TAG'] as const;
export type SearchOptions = typeof SEARCH_OPTIONS;

interface HookMember {
  currentType: string;
  isLoading: boolean;
  typeList: string[];
  currentTableData: World[];
  visibleAddWorldModal: boolean;
  infoModalWorld: World | undefined;
  editModalWorld: World | undefined;
  searchOptions: SearchOptions;

  onChangeSheetTab: (tabKey: string) => void;
  onOpenAddWorldModal: () => void;
  onCloseAddWorldModal: () => void;
  onOpenEditWorldModal: (world: World) => void;
  onCloseEditWorldModal: () => void;
  onAddWorld: (world: WorldEditInput) => void;
  onEditWorld: (key: string, world: WorldEditInput) => void;
  onRemoveWorld: (key: string) => void;
  onClickRefresh: () => void;
  onClickOpenWorldInfoModal: (world: World) => void;
  onClickCloseWorldInfoModal: () => void;
  onClickFavorite: (world: World) => void;
  onSearchWorlds: (text: string) => void;
  onChangeSearchOption: (option: SearchOptions[number]) => void;

  checkIsFavorite: (world: World) => boolean;
}
const useSearch = (): HookMember => {
  const [currentType, setCurrentType] = useState<string>('전체');
  const [worldData, setWorldData] = useRecoilState(worldDataState);
  const [searchText, setSearchText] = useState<string>();
  const [isLoading, setIsLoading] = useState(worldData === undefined);
  const [visibleAddWorldModal, setVisibleAddWorldModal] = useState(false);
  const [infoModalWorld, setInfoModalWorld] = useState<World | undefined>(
    undefined,
  );
  const [editModalWorld, setEditModalWorld] = useState<World | undefined>();
  const [favorites, setFavorites] = useRecoilState(worldFavoritesState);
  const [curSearchOption, setCurSearchOption] =
    useState<SearchOptions[number]>('NAME');

  useEffect(() => {
    if (worldData === undefined) {
      // TODO 공개용은 이걸로
      // getSheetWorldData().then((data) => {
      //   setIsLoading(false);
      //   return setWorldData(data);
      // });
      getWorldDataToMain().then((data) => {
        setIsLoading(false);
        return setWorldData(data);
      });
    }
  }, [setWorldData, worldData]);

  const typeList = useMemo(
    () =>
      worldData?.reduce(
        (acc, cur) => {
          if (acc.find((e) => e === cur.type)) {
            return acc;
          }
          return acc.concat(cur.type);
        },
        ['전체'],
      ) || [],
    [worldData],
  );
  const currentTableData = useMemo(
    () =>
      worldData
        ?.filter((w) => {
          if (currentType === '전체') {
            return true;
          }
          return w.type === currentType;
        })
        .filter((e) => {
          if (!searchText || searchText.trim() === '') {
            return true;
          }
          const words = searchText.split(' ');

          switch (curSearchOption) {
            case 'NAME':
              return (
                e.name.toLowerCase().search(searchText.toLowerCase()) !== -1
              );
            case 'AUTHOR':
              return (
                e.author.toLowerCase().search(searchText.toLowerCase()) !== -1
              );
            case 'DESCRIPTION':
              return (
                e.description.toLowerCase().search(searchText.toLowerCase()) !==
                -1
              );
            case 'TAG':
              return (
                e.tags.filter((t) => words.lastIndexOf(t) !== -1).length ===
                words.length
              );
          }
        })
        .reverse() || [],
    [curSearchOption, currentType, searchText, worldData],
  );
  return {
    currentType,
    isLoading,
    typeList,
    currentTableData,
    visibleAddWorldModal,
    infoModalWorld: infoModalWorld,
    editModalWorld: editModalWorld,
    searchOptions: SEARCH_OPTIONS,

    onChangeSheetTab(tabKey) {
      setCurrentType(tabKey);
    },
    onSearchWorlds(text) {
      setSearchText(text);
    },
    onOpenAddWorldModal() {
      setVisibleAddWorldModal(true);
    },
    onCloseAddWorldModal() {
      setVisibleAddWorldModal(false);
    },
    onOpenEditWorldModal(world) {
      setEditModalWorld(world);
    },
    onCloseEditWorldModal() {
      setEditModalWorld(undefined);
    },
    onAddWorld(world) {
      setIsLoading(true);
      addEditSheetToMain(world)
        .then(() => {
          message.info('월드가 추가되었습니다');
        })
        .then(() => {
          getSheetWorldData().then((data) => {
            setWorldData(data);
          });
        })
        .catch((e: Error) => message.error(e.toString()))
        .finally(() => setIsLoading(false));
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
    onClickRefresh() {
      setIsLoading(true);
      getSheetWorldData()
        .then((data) => {
          return setWorldData(data);
        })
        .finally(() => setIsLoading(false));
    },
    onClickOpenWorldInfoModal(w) {
      setInfoModalWorld(w);
    },
    onClickCloseWorldInfoModal() {
      setInfoModalWorld(undefined);
    },
    onClickFavorite(world) {
      if (!favorites) {
        message.loading('Favorite 불러오는 중');
        return;
      }
      setFavorites((v) => {
        const val = { ...v };
        val.favorite1 = [...val.favorite1];
        if (val.favorite1.find((e) => e === world.key)) {
          val.favorite1 = val.favorite1.filter((e) => e !== world.key);
          return val;
        }
        val.favorite1.push(world.key);
        return val;
      });
    },
    checkIsFavorite(world) {
      if (favorites?.favorite1) {
        return favorites.favorite1.find((e) => e === world.key) ? true : false;
      }
      return false;
    },
    onChangeSearchOption(option) {
      setCurSearchOption(option);
    },
  };
};

export default useSearch;
