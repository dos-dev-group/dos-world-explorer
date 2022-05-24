import { Favorites } from '@src/types';
import { app } from 'electron';

export function saveFavorites(favorites: Favorites) {
  console.log('path', app.getAppPath());
}
