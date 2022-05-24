import { ipcMain, shell } from 'electron';
import {
  testEditSheet,
  addEditSheet,
  removeEditSheet,
  modifyEditSheet,
  autoFile,
} from './utils/editSheet';
import { loadFavorites, saveFavorites } from './utils/filesystem';

export default function setupIpcListener() {
  ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
  });

  ipcMain.on('open-external-link', async (event, arg) => {
    console.log(`open external link: ${arg}`);
    if (arg.length > 0) {
      shell.openExternal(arg[0]);
    }
  });

  ipcMain.on('testEditSheetToMain', async (event, arg) => {
    event.reply('testEditSheetToMain', await testEditSheet());
  });

  ipcMain.on('addEditSheetToMain', async (event, arg) => {
    event.reply('addEditSheetToRenderer', await addEditSheet(arg[0]));
  });

  ipcMain.on('reomoveEditSheetToMain', async (event, arg) => {
    event.reply('reomoveEditSheetToRenderer', await removeEditSheet(arg[0]));
  });

  ipcMain.on('modifyEditSheetToMain', async (event, arg) => {
    event.reply(
      'modifyEditSheetToRenderer',
      await modifyEditSheet(arg[0], arg[1]),
    );
  });

  ipcMain.on('autoFileToMain', async (event, arg) => {
    event.reply('autoFileToRenderer', await autoFile(arg[0]));
  });

  ipcMain.on('saveFavorites', async (event, arg) => {
    try {
      event.reply('saveFavorites', await saveFavorites(arg[0]));
    } catch {
      event.reply('saveFavorites', null);
    }
  });
  ipcMain.on('loadFavorites', async (event, arg) => {
    try {
      event.reply('loadFavorites', await loadFavorites());
    } catch {
      event.reply('loadFavorites', null);
    }
  });
}
