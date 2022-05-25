import { worldFavoritesState } from '@src/renderer/data/favorites';
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

  onChangeType: (tabKey: string) => void;
  onClickFavorite: (world: World) => void;
  checkIsFavorite: (world: World) => boolean;
  onSearchWorlds: (text: string) => void;
  onChangeSearchOption: (option: SearchOptions[number]) => void;
}
const useFavoritePage = (): HookMember => {
  const [favorites, setFavorites] = useRecoilState(worldFavoritesState);
  const [currentType, setCurrentType] = useState<string>();
  const [curSearchText, setCurSearchText] = useState<string>();
  const [curSearchOption, setSearchOption] =
    useState<SearchOptions[number]>('NAME');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFavorites = useMemo(() => favorites, []);

  useEffect(() => {
    if (favorites && Object.keys(favorites).length > 0) {
      setCurrentType(Object.keys(favorites)[0]);
    }
  }, [favorites]);

  const worldData = (
    memoizedFavorites && currentType ? memoizedFavorites[currentType] : []
  )
    .concat()
    .reverse();

  return {
    currentType: currentType || '',
    typeList: memoizedFavorites ? Object.keys(memoizedFavorites) : [],
    worldData: worldData,
    searchOptions: SEARCH_OPTIONS,

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
        if (val.favorite1.find((e) => e.key === world.key)) {
          val.favorite1 = val.favorite1.filter((e) => e.key !== world.key);
          return val;
        }
        val.favorite1.push(world);
        return val;
      });
    },

    onChangeSearchOption(option) {},
    onSearchWorlds(text) {},

    checkIsFavorite(world) {
      if (favorites?.favorite1) {
        return favorites.favorite1.find((e) => e.key === world.key)
          ? true
          : false;
      }
      return false;
    },
  };
};

export default useFavoritePage;
