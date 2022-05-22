import {
  World,
  WorldData,
  WorldInput,
  WorldOutput,
  EditResult,
} from '@src/types';

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

export function addEditSheetToMain(worldInput: WorldInput) {
  window.electron.ipcRenderer.sendMessage('addEditSheetToMain', [worldInput]);

  return new Promise<EditResult>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'addEditSheetToRenderer',
      (result: unknown) => {
        resolve(result as EditResult);
      },
    );
  });
}

export function reomoveEditSheetToMain(key: string) {
  window.electron.ipcRenderer.sendMessage('reomoveEditSheetToMain', [key]);

  return new Promise<EditResult>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'reomoveEditSheetToRenderer',
      (result: unknown) => {
        resolve(result as EditResult);
      },
    );
  });
}

export function modifyEditSheetToMain(key: string, worldInput: WorldInput) {
  window.electron.ipcRenderer.sendMessage('modifyEditSheetToMain', [
    key,
    worldInput,
  ]);

  return new Promise<EditResult>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'modifyEditSheetToRenderer',
      (result: unknown) => {
        resolve(result as EditResult);
      },
    );
  });
}

export function autoFileToMain(worldUrl: string) {
  window.electron.ipcRenderer.sendMessage('autoFileToMain', [worldUrl]);
  return new Promise<WorldOutput>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'autoFileToRenderer',
      (result: unknown) => {
        resolve(result as WorldOutput);
      },
    );
  });
}
