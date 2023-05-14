import { StargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

import * as crypto from 'crypto';

interface Wallet {
  mnemonic: string;
  address: string;
  publicKey: Uint8Array;
}

export class AkashWallet {
  private wallet: Wallet | null;

  constructor() {
    this.wallet = null;
  }

  public async connect(): Promise<void> {
    const rpc = 'http://akash.c29r3.xyz:80/rpc';
    const client = await StargateClient.connect(rpc);
    const id = client.getChainId();
    const balance = client.getBalance(this.wallet.address, 'uakt');
  }

  public getBalance(): number {
    console.log('getBalance');
    if (!this.wallet) {
      throw new Error('No wallet loaded.');
    }
    return 5;
  }

  async createWallet(password: string) {
    console.log('createWallet');
    const hdWallet = await DirectSecp256k1HdWallet.generate();
    const mnemonic = hdWallet.mnemonic;
    const accounts = await hdWallet.getAccounts();
    const address = accounts[0].address;
    const publicKey = accounts[0].pubkey;
    this.wallet = { mnemonic, address, publicKey };
    this.saveWallet(password);
    return this.wallet;
  }

  async importWallet(mnemonic: string, password: string) {
    console.log('importWallet');
    const hdWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const accounts = await hdWallet.getAccounts();
    const address = accounts[0].address;
    const publicKey = accounts[0].pubkey;
    this.wallet = { mnemonic, address, publicKey };
    this.saveWallet(password);
    return this.wallet;
  }

  private loadWallet(password: string): Wallet | null {
    console.log('loadWallet');
    try {
      const encryptedData = localStorage.getItem('wallet');
      if (!encryptedData) {
        return null;
      }
      const decryptedData = this.decrypt(encryptedData, password);
      return JSON.parse(decryptedData);
    } catch (error) {
      return null;
    }
  }

  private saveWallet(password: string): void {
    console.log('saveWallet');
    if (!this.wallet) {
      throw new Error('No wallet loaded.');
    }
    const data = JSON.stringify(this.wallet);
    const encryptedData = this.encrypt(data, password);
    const checksum = crypto.createHash('shar256', data);

    localStorage.setItem('wallet', encryptedData);
  }

  private encrypt(data: string, password: string): string {
    console.log('encrypt');
    const key = crypto.scryptSync(password, 'GfG', 24);
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  private decrypt(data: string, password: string): string {
    console.log('decrypt');
    const [ivHex, encryptedHex] = data.split(':');
    const key = crypto.scryptSync(password, 'GfG', 24);
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
