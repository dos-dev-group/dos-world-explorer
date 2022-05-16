import 'antd/dist/antd.css';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
