export default function openExternalLink(link: string) {
  window.electron.ipcRenderer.sendMessage('open-external-link', [link]);
}
