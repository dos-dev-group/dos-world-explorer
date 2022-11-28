import { Bookmarks } from '@src/types';
import { atom, AtomEffect } from 'recoil';

const bookmarkEffect =
  (): AtomEffect<Bookmarks | undefined> =>
  ({ trigger, onSet, setSelf }) => {
    // if (trigger === 'get') {
    //   const savedValue = localStorage.getItem('worldBookmarksState');
    //   if (loadBo)
    //   loadBookmarks()
    //     .catch(() => saveBookmarks({ favorite1: [] }))
    //     .then((value) => setSelf(value));
    // }
    const savedValue = localStorage.getItem('worldBookmarksState');
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    } else {
      setSelf({ group1: [] });
    }

    onSet((newValue, _, isReset) => {
      if (isReset) {
        localStorage.removeItem('worldBookmarksState');
        return;
      }
      localStorage.setItem('worldBookmarksState', JSON.stringify(newValue));
      // if (newValue !== undefined) saveBookmarks(newValue);
    });
  };

export const worldBookmarksState = atom<Bookmarks | undefined>({
  key: 'worldBookmarksState',
  default: undefined,
  effects: [bookmarkEffect()],
});
