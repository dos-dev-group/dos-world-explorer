import { worldFavoritesState } from '@src/renderer/data/favorites';
import { worldDataState } from '@src/renderer/data/world';
import getSheetWorldData from '@src/renderer/utils/getSheetWorldData';
import openExternalLink from '@src/renderer/utils/ipc/openExternalLink';
import { WorldData, World } from '@src/types';
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
  modalWorldInfo: World | undefined;
  isLoading: boolean;

  onChangeType: (tabKey: string) => void;
  onClickFavorite: (world: World) => void;
  checkIsFavorite: (world: World) => boolean;
  onSearchWorlds: (text: string) => void;
  onChangeSearchOption: (option: SearchOptions[number]) => void;
  onClickToggleInfoModal: (world?: World) => void;
  onClickRefresh: () => void;
}
const useFavoritePage = (): HookMember => {
  const [favorites, setFavorites] = useRecoilState(worldFavoritesState);
  const [worldData, setWorldData] = useRecoilState(worldDataState);
  const [isLoading, setIsLoading] = useState(worldData === undefined);
  const [currentType, setCurrentType] = useState<string>();
  const [curSearchText, setCurSearchText] = useState<string>();
  const [curSearchOption, setSearchOption] =
    useState<SearchOptions[number]>('NAME');
  const [modalWorldInfo, setModalWorldInfo] = useState<World | undefined>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFavorites = useMemo(() => favorites, [worldData]);

  useEffect(() => {
    if (favorites && Object.keys(favorites).length > 0) {
      setCurrentType(Object.keys(favorites)[0]);
    }
  }, [favorites]);

  useEffect(() => {
    if (worldData === undefined) {
      getSheetWorldData().then((data) => {
        setIsLoading(false);
        return setWorldData(data);
      });
    }
  }, [setWorldData, worldData]);

  const favKeys =
    memoizedFavorites && currentType ? memoizedFavorites[currentType] : [];
  const worldTableData =
    worldData?.filter((w) =>
      favKeys.find((e) => e === w.key) ? true : false,
    ) || [];

  return {
    currentType: currentType || '',
    typeList: memoizedFavorites ? Object.keys(memoizedFavorites) : [],
    worldData: worldTableData,
    searchOptions: SEARCH_OPTIONS,
    // FIXME date 제대로 나오게 변환할것
    modalWorldInfo: modalWorldInfo
      ? { ...modalWorldInfo, date: new Date(0) }
      : undefined,
    isLoading,

    onChangeType(tabKey) {
      setCurrentType(tabKey);
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

    onChangeSearchOption(option) {},
    onSearchWorlds(text) {},

    checkIsFavorite(world) {
      if (favorites?.favorite1) {
        return favorites.favorite1.find((e) => e === world.key) ? true : false;
      }
      return false;
    },
  };
};

export default useFavoritePage;
