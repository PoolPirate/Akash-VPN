import { SigningStargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { stargate } from '@akashnetwork/akashjs';
import type { MsgCreateDeployment as MsgCreateDeploymentType } from '@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta1/deployment';
import * as crypto from 'crypto';

import { deployyaml } from './deploy';

import {
  DeploymentID,
  MsgCreateDeployment,
} from '@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta1/deployment';
import type { StdFee } from '@cosmjs/amino/build/signdoc';
import Long from 'long';
import { SDL } from '@akashnetwork/akashjs/build/sdl';

export class AkashWallet {
  private wallet: DirectSecp256k1HdWallet | null;
  private address: string;
  private client: SigningStargateClient | null;

  constructor() {
    this.address = 'null';
    this.client = null;
    this.wallet = null;
  }

  async performTransaction() {
    if (this.wallet == null) {
      throw new Error('No wallet loaded.');
    }

    if (this.client == null) {
      await this.connect();
    }

    const deploymentID: DeploymentID = {
      $type: 'akash.deployment.v1beta1.DeploymentID',
      owner: this.address,
      dseq: Long.ONE,
    };

    const sdl = await SDL.fromString(deployyaml, 'beta2').manifestVersion();

    const msgpartial = {
      $type: 'akash.deployment.v1beta1.MsgCreateDeployment',
      id: deploymentID,
      //groups: [],
      version: sdl,
      deposit: {
        $type: 'cosmos.base.v1beta1.Coin',
        denom: 'uakt',
        amount: '50000',
      },
    };
    const msg: MsgCreateDeploymentType =
      MsgCreateDeployment.fromPartial(msgpartial);

    const msgAny = {
      typeUrl: stargate.messages.MsgCreateDeployment,
      value: msg,
    };

    // @ts-ignore
    const gas = await this.client.simulate(this.address, [msgAny], '');

    const stdFee: StdFee = {
      gas: gas.toString(),
      amount: [
        {
          denom: 'uakt',
          amount: '3895',
        },
      ],
    };

    // @ts-ignore
    const signedTx = await this.client.sign(this.address, [msgAny], stdFee, '');

    // @ts-ignore
    const txResponse = await this.client.broadcastTx(signedTx);
  }

  getAddress(): string {
    return this.address;
  }

  getMnemonic(password: string): string {
    const encryptedMnemonic = localStorage.getItem('mnemonic');
    if (!encryptedMnemonic) {
      throw new Error('no wallet saved');
    }
    return this.decrypt(encryptedMnemonic, password);
  }

  private async connect() {
    if (this.wallet == null) {
      throw new Error('now wallet loaded');
    }
    const client = await SigningStargateClient.connectWithSigner(
      'https://rpc.akashnet.net',
      this.wallet
    );
    if (client == null) {
      throw new Error('no connection to https://rpc.akashnet.net');
    }
    this.client = client;
  }

  async getBalance(): Promise<string> {
    console.log('getBalance');
    if (this.wallet == null || this.address == null) {
      throw new Error('No wallet loaded.');
    }
    if (this.client == null) {
      await this.connect();
    }
    // @ts-ignore
    const balanceResponse = await this.client.getBalance(this.address, 'uakt');
    const balance = balanceResponse.amount.toString();
    return balance.valueOf();
  }

  async createWallet(password: string) {
    console.log('createWallet');
    this.wallet = await DirectSecp256k1HdWallet.generate(21, {
      prefix: 'akash',
    });
    let account = await this.wallet.getAccounts();
    this.address = account[0].address;
    this.saveWallet(password);
    return true;
  }

  async importWallet(mnemonic: string, password: string) {
    console.log('importWallet');
    this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: 'akash',
    });
    let account = await this.wallet.getAccounts();
    this.address = account[0].address;
    this.saveWallet(password);
    return true;
  }

  async loadWallet(password: string) {
    console.log('loadWallet');
    const encryptedMnemonic = localStorage.getItem('mnemonic');
    const checksumOld = localStorage.getItem('checksum');
    if (!encryptedMnemonic || !checksumOld) {
      throw new Error('no wallet saved');
    }
    const mnemonic = this.decrypt(encryptedMnemonic, password);
    //checksum
    const checksum = crypto.createHash('sha256').update(mnemonic).digest('hex');
    if (checksum != checksumOld) {
      console.log('checksum mismatch');
      return false;
    }
    //checksum
    this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: 'akash',
    });
    let account = await this.wallet.getAccounts();
    this.address = account[0].address;
    this.saveWallet(password);
    return true;
  }

  private saveWallet(password: string): void {
    console.log('saveWallet');
    if (!this.wallet) {
      throw new Error('No wallet loaded.');
    }
    const encryptedMnemonic = this.encrypt(password);
    const mnemonic = this.wallet.mnemonic;
    const checksum = crypto.createHash('sha256').update(mnemonic).digest('hex');
    localStorage.setItem('checksum', checksum);
    localStorage.setItem('mnemonic', encryptedMnemonic);
  }

  private encrypt(password: string): string {
    console.log('encrypt');
    if (!this.wallet) {
      throw new Error('No wallet loaded.');
    }
    const mnemonic = this.wallet.mnemonic;
    const key = crypto.scryptSync(password, 'GfG', 24);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
    let encrypted = cipher.update(mnemonic, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const encryptedData = `${iv.toString('hex')}:${encrypted}`;
    return encryptedData;
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
