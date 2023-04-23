import { StargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet, Registry } from '@cosmjs/proto-signing';

import * as crypto from 'crypto';

interface Wallet {
  mnemonic: string;
  address: string;
}

export class AkashWallet {
  private password: string;
  private wallet: Wallet | null;

  constructor() {
    this.password = '';
    this.wallet = null;
  }

  public test(): void {
    console.log('test');
  }

  public async connect(): Promise<void> {
    const rpc = 'http://akash.c29r3.xyz:80/rpc';
    const client = await StargateClient.connect(rpc);
    const id = client.getChainId();
    const balance = client.getBalance(this.wallet.address, 'uakt');
  }

  public setPassword(password: string): void {
    this.password = password;
    this.wallet = this.loadWallet();
  }

  public getBalance(): number {
    if (!this.wallet) {
      throw new Error('No wallet loaded.');
    }

    return 5;
  }

  async createWallet(): Promise<void> {
    const hdWallet = await DirectSecp256k1HdWallet.generate(24);
    const mnemonic = hdWallet.mnemonic;
    const address = await await hdWallet.getAccounts()[0];
    this.wallet = { mnemonic, address };
    this.saveWallet();
  }

  async importWallet(mnemonic: string): Promise<void> {
    const hdWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const address = await await hdWallet.getAccounts()[0];
    this.wallet = { mnemonic, address };
    this.saveWallet();
  }

  private loadWallet(): Wallet | null {
    try {
      const encryptedData = localStorage.getItem('wallet');
      if (!encryptedData) {
        return null;
      }
      const decryptedData = this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      return null;
    }
  }

  private saveWallet(): void {
    if (!this.wallet) {
      throw new Error('No wallet loaded.');
    }
    const data = JSON.stringify(this.wallet);
    const encryptedData = this.encrypt(data);
    localStorage.setItem('wallet', encryptedData);
  }

  private encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.password, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  private decrypt(data: string): string {
    const [ivHex, encryptedHex] = data.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.password, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
