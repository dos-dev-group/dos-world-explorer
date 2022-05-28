import { WorldVrcRaw } from '@src/types';

export function testVrchatAPIToMain() {
  window.electron.ipcRenderer.sendMessage('testVrchatAPIToMain', []);
  return new Promise<WorldVrcRaw>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'testVrchatAPIToRenderer',
      (result: unknown) => {
        resolve(result as WorldVrcRaw);
      },
    );
  });
}

export function getVrchatRencentWorldsToMain() {
  window.electron.ipcRenderer.sendMessage('getVrchatRencentWorldsToMain', []);
  return new Promise<WorldVrcRaw>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'getVrchatRencentWorldsToRenderer',
      (result: unknown) => {
        resolve(result as WorldVrcRaw);
      },
    );
  });
}
