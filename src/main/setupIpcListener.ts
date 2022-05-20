import { ipcMain, shell } from 'electron';
import {
  testEditSheet,
  addEditSheet,
  removeEditSheet,
  modifyEditSheet,
} from './utils/editSheet';

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
    event.reply('testEditSheetToMain', await testEditSheet(arg[0]));
  });

  ipcMain.on('addEditSheetToMain', async (event, arg) => {
    event.reply(
      'addEditSheetToRenderer',
      await addEditSheet(arg[0], arg[1], arg[2]),
    );
  });

  ipcMain.on('reomoveEditSheetToMain', async (event, arg) => {
    event.reply(
      'reomoveEditSheetToRenderer',
      await removeEditSheet(arg[0], arg[1], arg[2]),
    );
  });

  ipcMain.on('modifyEditSheetToMain', async (event, arg) => {
    event.reply(
      'modifyEditSheetToRenderer',
      await modifyEditSheet(arg[0], arg[1], arg[2], arg[3]),
    );
  });
}
