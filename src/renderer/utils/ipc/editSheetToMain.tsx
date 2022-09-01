import {
  World,
  WorldData,
  WorldEditInput,
  WorldEditOutput,
  EditResult,
  SheetBaseType,
} from '@src/types';
import { NoDataError } from '../error';

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

export function getWorldDataToMain() {
  window.electron.ipcRenderer.sendMessage('getWorldDataToMain', []);
  return new Promise<WorldData>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'getWorldDataToRenderer',
      (result: unknown) => {
        resolve(result as WorldData);
      },
    );
  });
}

export function addSheetToMain(
  type: 'World' | 'SuggestWorld' | 'TagStyle',
  input: any,
) {
  window.electron.ipcRenderer.sendMessage('addSheetToMain', [type, input]);

  return new Promise<EditResult>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'addSheetToRenderer',
      (result: unknown) => {
        const er = result as EditResult;
        if (er === EditResult.ALREADYEXIST) {
          reject(new Error('이미 존재합니다.'));
        } else if (er === EditResult.NOTEXIST) {
          reject(new Error('존재하지 않습니다.'));
        } else if (er === EditResult.PROTECTED) {
          reject(new Error('다른곳에서 먼저 사용되고 있습니다.'));
        } else if (er === EditResult.TYPEERROR) {
          reject(new Error('타입이 맞지않습니다'));
        } else if (er === EditResult.UNKNOWN) {
          reject(new Error('알 수 없는 오류 발생'));
        }
        resolve(er);
      },
    );
  });
}

export function addEditSheetToMain(worldInput: WorldEditInput) {
  window.electron.ipcRenderer.sendMessage('addSheetToMain', [
    'World',
    worldInput,
    'addEditSheetToRenderer',
  ]);

  return new Promise<EditResult>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'addEditSheetToRenderer',
      (result: unknown) => {
        const er = result as EditResult;
        if (er === EditResult.ALREADYEXIST) {
          reject(new Error('이미 존재합니다.'));
        } else if (er === EditResult.NOTEXIST) {
          reject(new Error('존재하지 않습니다.'));
        } else if (er === EditResult.PROTECTED) {
          reject(new Error('다른곳에서 먼저 사용되고 있습니다.'));
        } else if (er === EditResult.TYPEERROR) {
          reject(new Error('타입이 맞지않습니다'));
        } else if (er === EditResult.UNKNOWN) {
          reject(new Error('알 수 없는 오류 발생'));
        }
        resolve(er);
      },
    );
  });
}

export function reomoveEditSheetToMain(key: string) {
  window.electron.ipcRenderer.sendMessage('reomoveSheetToMain', [
    'World',
    key,
    'reomoveEditSheetToRenderer',
  ]);

  return new Promise<EditResult>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'reomoveEditSheetToRenderer',
      (result: unknown) => {
        const er = result as EditResult;
        if (er === EditResult.ALREADYEXIST) {
          reject(new Error('이미 존재합니다.'));
        } else if (er === EditResult.NOTEXIST) {
          reject(new Error('존재하지 않습니다.'));
        } else if (er === EditResult.PROTECTED) {
          reject(new Error('다른곳에서 먼저 사용되고 있습니다.'));
        } else if (er === EditResult.TYPEERROR) {
          reject(new Error('타입이 맞지않습니다'));
        } else if (er === EditResult.UNKNOWN) {
          reject(new Error('알 수 없는 오류 발생'));
        }
        resolve(er);
      },
    );
  });
}

export function modifyEditSheetToMain(key: string, worldInput: WorldEditInput) {
  window.electron.ipcRenderer.sendMessage('modifySheetToMain', [
    'World',
    key,
    worldInput,
    'modifyEditSheetToRenderer',
  ]);

  return new Promise<EditResult>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'modifyEditSheetToRenderer',
      (result: unknown) => {
        const er = result as EditResult;
        if (er === EditResult.ALREADYEXIST) {
          reject(new Error('이미 존재합니다.'));
        } else if (er === EditResult.NOTEXIST) {
          reject(new Error('존재하지 않습니다.'));
        } else if (er === EditResult.PROTECTED) {
          reject(new Error('다른곳에서 먼저 사용되고 있습니다.'));
        } else if (er === EditResult.TYPEERROR) {
          reject(new Error('타입이 맞지않습니다'));
        } else if (er === EditResult.UNKNOWN) {
          reject(new Error('알 수 없는 오류 발생'));
        }
        resolve(er);
      },
    );
  });
}

export function autoFileToMain(worldUrl: string) {
  window.electron.ipcRenderer.sendMessage('autoFileToMain', [worldUrl]);
  return new Promise<WorldEditOutput>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'autoFileToRenderer',
      (result: unknown) => {
        resolve(result as WorldEditOutput);
      },
    );
  });
}
