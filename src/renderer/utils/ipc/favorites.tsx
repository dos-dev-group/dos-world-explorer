import { Favorites } from '@src/types';
import { NoDataError } from '../error';

export function saveFavorites(favorites: Favorites) {
  window.electron.ipcRenderer.sendMessage('saveFavorites', [favorites]);
  return new Promise<Favorites>((resolve, reject) => {
    window.electron.ipcRenderer.once('saveFavorites', (result: unknown) => {
      if (result === null) reject(new Error('Fail to Save Favorites'));
      console.log('saveFavorites', result);
      resolve(result as Favorites);
    });
  });
}

export function loadFavorites() {
  window.electron.ipcRenderer.sendMessage('loadFavorites', []);
  return new Promise<Favorites>((resolve, reject) => {
    window.electron.ipcRenderer.once('loadFavorites', (result: unknown) => {
      if (result === null) {
        reject(new NoDataError('Fail Load Favorites'));
      }
      resolve(JSON.parse(JSON.stringify(result)) as Favorites);
    });
  });
}
