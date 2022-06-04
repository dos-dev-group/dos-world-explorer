import { ipcMain, shell } from 'electron';
import {
  testEditSheet,
  getWorldData,
  addEditSheet,
  removeEditSheet,
  modifyEditSheet,
  autoFile,
} from './utils/editSheet';
import {
  testVrchatAPI,
  getVrchatRencentWorlds,
  getFriednList,
  generatedWorldInstanceInfo,
  sendInvites,
  genWorldInstanceName,
  login,
} from './utils/vrchatAPI';
import { loadFavorites, saveFavorites } from './utils/favorites';

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

  // ###################################### for vrchatAPI.tsx ######################################

  ipcMain.on('testVrchatAPIToMain', async (event, arg) => {
    event.reply('testVrchatAPIToRenderer', await testVrchatAPI());
  });

  ipcMain.on('loginToMain', async (event, arg) => {
    event.reply('loginToRenderer', await login(arg[0], arg[1]));
  });

  ipcMain.on('getFriednListToMain', async (event, arg) => {
    event.reply('getFriednListToRenderer', await getFriednList());
  });

  ipcMain.on('generatedWorldInstanceInfoToMain', async (event, arg) => {
    // testVrchatAPI();
    event.reply(
      'generatedWorldInstanceInfoToRenderer',
      generatedWorldInstanceInfo(arg[0], arg[1], arg[2], arg[3]),
    );
  });

  ipcMain.on('sendInvitesToMain', async (event, arg) => {
    // testVrchatAPI();
    event.reply(
      'sendInvitesToRenderer',
      await sendInvites(arg[0], arg[1], arg[2]),
    );
  });

  ipcMain.on('genWorldInstanceNameToMain', async (event, arg) => {
    // testVrchatAPI();
    event.reply(
      'genWorldInstanceNameToRenderer',
      await genWorldInstanceName(arg[0]),
    );
  });

  ipcMain.on('getVrchatRencentWorldsToMain', async (event, arg) => {
    event.reply(
      'getVrchatRencentWorldsToRenderer',
      await getVrchatRencentWorlds(),
    );
  });

  // ###################################### for editSheet.tsx ######################################

  ipcMain.on('testEditSheetToMain', async (event, arg) => {
    event.reply('testEditSheetToRenderer', await testEditSheet());
  });

  ipcMain.on('getWorldDataToMain', async (event, arg) => {
    event.reply('getWorldDataToRenderer', await getWorldData());
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

  // ###################################### for favorites.tsx ######################################

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
