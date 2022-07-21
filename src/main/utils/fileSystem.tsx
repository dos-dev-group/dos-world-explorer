import { Bookmarks } from '@src/types';
import { app, dialog, shell } from 'electron';
import { constants } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

const FAV_PATH = path.join(
  app.getPath('documents'),
  app.getName(),
  'favorites.json',
);

export function saveBookmarks(bookmarks: Bookmarks) {
  return fs
    .access(FAV_PATH, constants.R_OK)
    .catch(() => fs.mkdir(path.dirname(FAV_PATH), { recursive: true }))
    .then(() => fs.writeFile(FAV_PATH, JSON.stringify(bookmarks)))
    .then(() => bookmarks);
}

export function loadBookmarks(): Promise<Bookmarks> {
  return fs.readFile(FAV_PATH).then((v: Buffer) => JSON.parse(v.toString()));
}

export async function saveBookmarkToFileDialog(bookmarks: Bookmarks) {
  const dialogResult = await dialog.showSaveDialog({
    title: '북마크의 저장 경로를 선택해주세요.',
    defaultPath: app.getPath('downloads'),
    filters: [
      {
        name: 'bookmarks',
        extensions: ['json'],
      },
    ],
  });
  if (dialogResult.canceled) {
    throw new Error('Canceled');
  }

  const targetDirectory = dialogResult.filePath as string;
  return fs
    .access(targetDirectory, constants.R_OK)
    .catch(() => fs.mkdir(path.dirname(targetDirectory), { recursive: true }))
    .then(() =>
      fs.writeFile(targetDirectory, JSON.stringify(bookmarks, null, 2)),
    )
    .then(() => bookmarks);
}

export async function loadBookmarkFromFileDialog(): Promise<Bookmarks> {
  const dialogResult = await dialog.showOpenDialog({
    title: '불러올 북마크를 선택해주세요.',
    defaultPath: app.getPath('documents'),
    properties: ['openFile'],
    filters: [
      {
        name: 'bookmarks',
        extensions: ['json'],
      },
    ],
  });
  if (dialogResult.canceled) {
    throw new Error('Canceled');
  }

  const filePath = dialogResult.filePaths[0];
  return fs.readFile(filePath).then((v: Buffer) => JSON.parse(v.toString()));
}
