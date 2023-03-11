/* eslint-disable prettier/prettier */
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { createWallet,importWallet,getWallet,isWalletConnected } from "./wallet";


import { execSync } from 'child_process'


function listVirtualAdapter(adapterName:string):boolean {
  let nicListOutput = " ";
  try {
    // list all virtual network adapter
    nicListOutput = execSync(`vpncmd /Client localhost /CMD NicList`, {
      windowsHide: true
    }).toString(); 

    console.log(`\n${nicListOutput}`);

  } catch (err) {
    console.error(`Failed to list virtual adapters:`, err);
  }
  return nicListOutput.includes(`VPN${adapterName}`);
}

function createVirtualAdapter(adapterName:string):void {
  try {
    // Create a new virtual network adapter
    execSync(`vpncmd /Client localhost /CMD NicCreate VPN${adapterName}`, {
      stdio: 'ignore',
      windowsHide: true
    });

    // Enable the new adapter
    execSync(`vpncmd /Client localhost /CMD NiceEnable VPN${adapterName}`, {
      stdio: 'ignore',
      windowsHide: true
    });

    console.log(`Virtual adapter ${adapterName}Virtual created successfully.`);
  } catch (err) {
    console.error(`Failed to create virtual adapter ${adapterName}:`, err);
  }
}



// Custom APIs for renderer
const api = {createVirtualAdapter,listVirtualAdapter,createWallet,importWallet,getWallet,isWalletConnected}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
