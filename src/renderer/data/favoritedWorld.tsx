import { Bookmarks, DosFavoriteWorldGroup } from '@src/types';
import { atom, AtomEffect, useRecoilState } from 'recoil';
import {
  addFavoriteWorldToMain,
  getFavoritedWorldsToMain,
  removeFavoriteWorldToMain,
} from '../utils/ipc/vrchatAPIToMain';

interface HookMember {
  favoritedWorlds: DosFavoriteWorldGroup[] | undefined;
  addFavorite(where: string, worldId: string): Promise<void>;
  removeFavorite(worldId: string): Promise<void>;
  refresh(): Promise<void>;
  checkHasFavorite(worldId: string): DosFavoriteWorldGroup | undefined;
}

const favoriteEffect =
  (): AtomEffect<DosFavoriteWorldGroup[] | undefined> =>
  ({ trigger, onSet, setSelf }) => {
    if (trigger === 'get') {
      getFavoritedWorldsToMain().then((value) => {
        setSelf(value);
      });
    }
  };

const favoritedWorldState = atom<DosFavoriteWorldGroup[] | undefined>({
  key: 'favoritedWorldState',
  default: undefined,
  effects: [favoriteEffect()],
});

export const useFavoritedWorld = () => {
  const [favoritedWorlds, setFavoritedWorlds] =
    useRecoilState(favoritedWorldState);

  const hookMember: HookMember = {
    favoritedWorlds,
    async addFavorite(where: string, worldId: string) {
      const result = await addFavoriteWorldToMain(where, worldId);
      if (!result) throw new Error('Fail to Add Favorite');
      await hookMember.refresh();
    },
    async removeFavorite(worldId: string) {
      const result = await removeFavoriteWorldToMain(worldId);
      if (!result) throw new Error('Fail to Remove Favorite');
      await hookMember.refresh();
    },
    async refresh(): Promise<void> {
      setFavoritedWorlds(await getFavoritedWorldsToMain());
    },
    checkHasFavorite(favoriteName: string): DosFavoriteWorldGroup | undefined {
      if (!favoritedWorlds) return undefined;
      const result = favoritedWorlds.find((e) =>
        e.favorites.find((f) => f.id === favoriteName),
      );
      return result;
    },
  };
  return hookMember;
};
