import { Bookmarks } from '@src/types';
import { NoDataError } from '../error';

export function saveFavorites(favorites: Bookmarks) {
  window.electron.ipcRenderer.sendMessage('saveBookmarks', [favorites]);
  return new Promise<Bookmarks>((resolve, reject) => {
    window.electron.ipcRenderer.once('saveBookmarks', (result: unknown) => {
      if (result === null) reject(new Error('Fail to Save Favorites'));
      resolve(result as Bookmarks);
    });
  });
}

export function loadFavorites() {
  window.electron.ipcRenderer.sendMessage('loadBookmarks', []);
  return new Promise<Bookmarks>((resolve, reject) => {
    window.electron.ipcRenderer.once('loadBookmarks', (result: unknown) => {
      if (result === null) {
        reject(new NoDataError('Fail Load Favorites'));
      }
      // eslint-disable-next-line no-new-object
      resolve(new Object(result) as Bookmarks);
    });
  });
}
