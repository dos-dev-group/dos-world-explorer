import packageMetadata from '@src/../package.json';

const APP_NAME = packageMetadata.name;

interface FileData {
  app: string;
  type: string;
  data: unknown;
}

export function showSaveFileDialog<T = unknown>(type: string, target: T) {
  window.electron.ipcRenderer.sendMessage('showSaveFileDialog', [
    {
      app: APP_NAME,
      type: type,
      data: target,
    },
  ]);
  return new Promise<T>((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'saveBookmarkToFileDialog',
      (result: unknown) => {
        if (result === null) reject(new Error('Canceled'));
        resolve(result as T);
      },
    );
  });
}

export function showLoadFileDialog<T = unknown>(type: string) {
  window.electron.ipcRenderer.sendMessage('showLoadFileDialog', []);
  return new Promise<T>((resolve, reject) => {
    window.electron.ipcRenderer.once('showLoadFileDialog', (result: any) => {
      const fileData = result as FileData;
      if (fileData === null) {
        reject(new Error('Canceled'));
        return;
      }
      if (fileData?.app !== APP_NAME) {
        reject(new Error('Not matched this app'));
        return;
      }
      if (fileData?.type !== type) {
        reject(new Error('Not matched type'));
        return;
      }

      resolve(fileData.data as T);
    });
  });
}
