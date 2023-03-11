import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

const STORAGE_KEY = 'my_wallet'

export async function createWallet(): Promise<void> {
  const wallet = await DirectSecp256k1HdWallet.generate()
  const mnemonic = await wallet.mnemonic
  const [account] = await wallet.getAccounts()

  console.log(`Wallet created successfully.`)
  console.log(`Address: ${account.address}`)
  console.log(`Mnemonic: ${mnemonic}`)

  // Store the mnemonic in local storage
  localStorage.setItem(STORAGE_KEY, mnemonic)
}

export async function importWallet(mnemonic: string): Promise<void> {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic)
  const [account] = await wallet.getAccounts()

  console.log(`Wallet imported successfully.`)
  console.log(`Address: ${account.address}`)

  // Store the mnemonic in local storage
  localStorage.setItem(STORAGE_KEY, mnemonic)
}

export async function getWallet() {
  const mnemonic = localStorage.getItem(STORAGE_KEY)
  if (!mnemonic) {
    throw new Error('No mnemonic found in local storage.')
  }
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic)
  return wallet
}

export function isWalletConnected(): boolean {
  const mnemonic = localStorage.getItem(STORAGE_KEY)
  if (mnemonic == null || mnemonic.length == 0) {
    return false
  }
  return true
}

export function getAddress() {
  const mnemonic = localStorage.getItem(STORAGE_KEY)
  if (mnemonic == null || mnemonic.length == 0) {
    return false
  }
  return true
}
