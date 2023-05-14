import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

import { AkashWallet } from './wallet';
import { SoftEther } from './soft-ether';

let akashWallet: AkashWallet;
let softether: SoftEther;

function init() {
  console.log('init');
  akashWallet = new AkashWallet();
  softether = new SoftEther();
}

// Custom APIs for renderer
const api = {
  init,
  test: () => akashWallet.test(),
  createWallet: () => akashWallet.createWallet(),
  importWallet: (mnemonic: string) => akashWallet.importWallet(mnemonic),
  setPassword: (password: string) => akashWallet.setPassword(password),
  getBalance: () => akashWallet.getBalance(),
  connect: () => akashWallet.connect(),
  createVirtualAdapter: (adapterName: string) =>
    softether.createVirtualAdapter(adapterName),
  deleteVirtualAdapter: (adapterName: string) =>
    softether.deleteVirtualAdapter(adapterName),
  enableVirtualAdapter: (adapterName: string) =>
    softether.enableVirtualAdapter(adapterName),
  disableVirtualAdapter: (adapterName: string) =>
    softether.disableVirtualAdapter(adapterName),
  connectToVPN: (
    serverAdress: string,
    port: string,
    username: string,
    password: string
  ) => softether.connectToVPN(serverAdress, port, username, password),
  disconnectFromVPN: () => softether.disconnectFromVPN(),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
