import { Favorites } from '@src/types';
import { app, shell } from 'electron';
import { constants } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

const FAV_PATH = path.join(
  app.getPath('documents'),
  app.getName(),
  'favorites.json',
);

export function saveFavorites(favorites: Favorites) {
  console.log('path', FAV_PATH);
  return fs
    .access(FAV_PATH, constants.R_OK)
    .catch(() => fs.mkdir(path.dirname(FAV_PATH), { recursive: true }))
    .then(() => fs.writeFile(FAV_PATH, JSON.stringify(favorites)))
    .then(() => favorites);
}

export function loadFavorites(): Promise<Favorites> {
  return fs.readFile(FAV_PATH).then((v: Buffer) => JSON.parse(v.toString()));
}
