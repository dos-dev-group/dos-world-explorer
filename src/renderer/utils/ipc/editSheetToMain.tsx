import { World, WorldData } from '@src/types';

export function testEditSheetToMain(typeId: number) {
  window.electron.ipcRenderer.sendMessage('testEditSheetToMain', [typeId]);
  return new Promise<number>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'testEditSheetToRenderer',
      (result: unknown) => {
        resolve(result as number);
      },
    );
  });
}

export function addEditSheetToMain(world: World, typeId: number) {
  window.electron.ipcRenderer.sendMessage('addEditSheetToMain', [
    world,
    typeId,
  ]);

  return new Promise<boolean>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'addEditSheetToRenderer',
      (result: unknown) => {
        resolve(result as boolean);
      },
    );
  });
}

export function reomoveEditSheetToMain(
  world: World,
  typeId: number,
  worldData: WorldData,
) {
  window.electron.ipcRenderer.sendMessage('reomoveEditSheetToMain', [
    world,
    typeId,
    worldData,
  ]);

  return new Promise<boolean>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'reomoveEditSheetToRenderer',
      (result: unknown) => {
        resolve(result as boolean);
      },
    );
  });
}

export function modifyEditSheetToMain(
  world: World,
  newWorld: World,
  type: string,
  worldData: WorldData,
) {
  window.electron.ipcRenderer.sendMessage('modifyEditSheetToMain', [
    world,
    newWorld,
    type,
    worldData,
  ]);

  return new Promise<boolean>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'modifyEditSheetToRenderer',
      (result: unknown) => {
        resolve(result as boolean);
      },
    );
  });
}