import { Bookmarks } from '@src/types';
import { atom, AtomEffect } from 'recoil';
import { loadFavorites, saveFavorites } from '../utils/ipc/bookmarksUtils';

const bookmarkEffect =
  (): AtomEffect<Bookmarks | undefined> =>
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

export const worldBookmarksState = atom<Bookmarks | undefined>({
  key: 'worldFavoritesState',
  default: undefined,
  effects: [bookmarkEffect()],
});
