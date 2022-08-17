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
  getVrchatRecentWorlds,
  getFriednList,
  generatedWorldInstanceInfo,
  sendInvites,
  genWorldInstanceName,
  login,
  logout,
  sendSelfInvite,
} from './utils/vrchatAPI';
import {
  loadBookmarkFromFileDialog,
  loadBookmarks,
  saveBookmarks,
  saveBookmarkToFileDialog,
} from './utils/fileSystem';

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

  ipcMain.on('logoutToMain', async (event, arg) => {
    event.reply('logoutToRenderer', await logout());
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

  ipcMain.on('sendSelfInviteToMain', async (event, arg) => {
    // testVrchatAPI();
    event.reply(
      'sendSelfInviteToRenderer',
      await sendSelfInvite(arg[0], arg[1]),
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
      await getVrchatRecentWorlds(),
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

  // ###################################### for bookmarks ######################################

  ipcMain.on('saveBookmarks', async (event, arg) => {
    try {
      event.reply('saveBookmarks', await saveBookmarks(arg[0]));
    } catch {
      event.reply('saveBookmarks', null);
    }
  });
  ipcMain.on('loadBookmarks', async (event, arg) => {
    try {
      event.reply('loadBookmarks', await loadBookmarks());
    } catch {
      event.reply('loadBookmarks', null);
    }
  });
  ipcMain.on('saveBookmarkToFileDialog', async (event, arg) => {
    try {
      event.reply(
        'saveBookmarkToFileDialog',
        await saveBookmarkToFileDialog(arg[0]),
      );
    } catch {
      event.reply('saveBookmarkToFileDialog', null);
    }
  });
  ipcMain.on('loadBookmarkFromFileDialog', async (event, arg) => {
    try {
      event.reply(
        'loadBookmarkFromFileDialog',
        await loadBookmarkFromFileDialog(),
      );
    } catch {
      event.reply('loadBookmarkFromFileDialog', null);
    }
  });
}
