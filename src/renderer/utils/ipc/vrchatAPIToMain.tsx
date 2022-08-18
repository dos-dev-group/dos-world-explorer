import { User, WorldVrcRaw } from '@src/types';

export function testVrchatAPIToMain() {
  window.electron.ipcRenderer.sendMessage('testVrchatAPIToMain', []);
  return new Promise<any>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'testVrchatAPIToRenderer',
      (result: unknown) => {
        resolve(result as any);
      },
    );
  });
}

export function loginToMain(id: string, pw: string) {
  window.electron.ipcRenderer.sendMessage('loginToMain', [id, pw]);
  return new Promise<void>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'loginToRenderer',
      (resultIpc: unknown) => {
        const result = resultIpc as boolean;
        // console.log('renderer: login result', result);
        if (result) {
          resolve();
        } else {
          reject();
        }
      },
    );
  });
}

export function logoutToMain() {
  window.electron.ipcRenderer.sendMessage('logoutToMain', []);
  return new Promise<boolean>((resolve, reject) => {
    window.electron.ipcRenderer.once('logoutToRenderer', (result: unknown) => {
      resolve(result as boolean);
    });
  });
}

export function getFriednListToMain() {
  window.electron.ipcRenderer.sendMessage('getFriednListToMain', []);
  return new Promise<User[]>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'getFriednListToRenderer',
      (result: unknown) => {
        resolve(result as User[]);
      },
    );
  });
}

export function generatedWorldInstanceInfoToMain(
  instanceName: string,
  instanceType: string,
  ownerId: string,
  region: string,
) {
  window.electron.ipcRenderer.sendMessage('generatedWorldInstanceInfoToMain', [
    instanceName,
    instanceType,
    ownerId,
    region,
  ]);
  return new Promise<string>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'generatedWorldInstanceInfoToRenderer',
      (result: unknown) => {
        resolve(result as string);
      },
    );
  });
}

export function sendInvitesToMain(
  userList: User[],
  worldId: string,
  instanceId: string,
) {
  window.electron.ipcRenderer.sendMessage('sendInvitesToMain', [
    userList,
    worldId,
    instanceId,
  ]);
  return new Promise<string>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'sendInvitesToRenderer',
      (result: unknown) => {
        resolve(result as string);
      },
    );
  });
}

export function sendSelfInviteToMain(worldId: string, instanceId: string) {
  window.electron.ipcRenderer.sendMessage('sendSelfInviteToMain', [
    worldId,
    instanceId,
  ]);
  return new Promise<string>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'sendSelfInviteToRenderer',
      (result: unknown) => {
        resolve(result as string);
      },
    );
  });
}

export function genWorldInstanceNameToMain(worldId: string) {
  window.electron.ipcRenderer.sendMessage('genWorldInstanceNameToMain', [
    worldId,
  ]);
  return new Promise<string>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'genWorldInstanceNameToRenderer',
      (result: unknown) => {
        resolve(result as string);
      },
    );
  });
}

export function getVrchatRecentWorldsToMain() {
  window.electron.ipcRenderer.sendMessage('getVrchatRencentWorldsToMain', []);
  return new Promise<WorldVrcRaw[]>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'getVrchatRencentWorldsToRenderer',
      (result: unknown) => {
        resolve(result as WorldVrcRaw[]);
      },
    );
  });
}
