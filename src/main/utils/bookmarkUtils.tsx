import { Bookmarks } from '@src/types';
import { app, shell } from 'electron';
import { constants } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

const FAV_PATH = path.join(
  app.getPath('documents'),
  app.getName(),
  'favorites.json',
);

export function saveBookmarks(favorites: Bookmarks) {
  return fs
    .access(FAV_PATH, constants.R_OK)
    .catch(() => fs.mkdir(path.dirname(FAV_PATH), { recursive: true }))
    .then(() => fs.writeFile(FAV_PATH, JSON.stringify(favorites, null, 2)))
    .then(() => favorites);
}

export function loadBookmarks(): Promise<Bookmarks> {
  return fs.readFile(FAV_PATH).then((v: Buffer) => JSON.parse(v.toString()));
}
