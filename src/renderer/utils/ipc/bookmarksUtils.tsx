import { Bookmarks } from '@src/types';
import { NoDataError } from '../error';

export function saveBookmarks(bookmarks: Bookmarks) {
  window.electron.ipcRenderer.sendMessage('saveBookmarks', [bookmarks]);
  return new Promise<Bookmarks>((resolve, reject) => {
    window.electron.ipcRenderer.once('saveBookmarks', (result: unknown) => {
      if (result === null) reject(new Error('Fail to Save Bookmarks'));
      resolve(result as Bookmarks);
    });
  });
}

export function loadBookmarks() {
  window.electron.ipcRenderer.sendMessage('loadBookmarks', []);
  return new Promise<Bookmarks>((resolve, reject) => {
    window.electron.ipcRenderer.once('loadBookmarks', (result: unknown) => {
      if (result === null) {
        reject(new NoDataError('Fail Load Bookmarks'));
      }
      // eslint-disable-next-line no-new-object
      resolve(new Object(result) as Bookmarks);
    });
  });
}
