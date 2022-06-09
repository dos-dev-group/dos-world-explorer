import { Bookmarks } from '@src/types';
import { atom, AtomEffect } from 'recoil';
import { loadBookmarks, saveBookmarks } from '../utils/ipc/bookmarksUtils';

const bookmarkEffect =
  (): AtomEffect<Bookmarks | undefined> =>
  ({ trigger, onSet, setSelf }) => {
    if (trigger === 'get') {
      loadBookmarks()
        .catch(() => saveBookmarks({ favorite1: [] }))
        .then((value) => setSelf(value));
    }

    onSet((newValue, _, isReset) => {
      if (newValue !== undefined) saveBookmarks(newValue);
    });
  };

export const worldBookmarksState = atom<Bookmarks | undefined>({
  key: 'worldBookmarksState',
  default: undefined,
  effects: [bookmarkEffect()],
});
