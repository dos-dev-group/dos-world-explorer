import { Favorites } from '@src/types';
import { atom, AtomEffect } from 'recoil';
import { loadFavorites, saveFavorites } from '../utils/ipc/favoritesUtils';

const favoriteEffect =
  (): AtomEffect<Favorites | undefined> =>
  ({ trigger, onSet, setSelf }) => {
    if (trigger === 'get') {
      loadFavorites()
        .catch(() => saveFavorites({ favorite1: [] }))
        .then((value) => setSelf(value));
    }

    onSet((newValue, _, isReset) => {
      if (newValue !== undefined) saveFavorites(newValue);
    });
  };

export const worldFavoritesState = atom<Favorites | undefined>({
  key: 'worldFavoritesState',
  default: undefined,
  effects: [favoriteEffect()],
});
