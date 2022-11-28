import packageMetadata from '@src/../package.json';

const APP_NAME = packageMetadata.name;

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
      if (result === null) {
        reject(new Error('Canceled'));
        return;
      }
      if (result?.app !== APP_NAME) {
        reject(new Error('Not matched this app'));
        return;
      }
      if (result?.type !== type) {
        reject(new Error('Not matched type'));
        return;
      }

      resolve(result as T);
    });
  });
}
