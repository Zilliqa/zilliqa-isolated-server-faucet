import 'babel-polyfill';
import { BN, Long, bytes } from '@zilliqa-js/util';
import { Zilliqa } from '@zilliqa-js/zilliqa';
import fs from 'fs-extra';

require('dotenv').config();

const ZILS_PER_ACCOUNT = process.env.ZILS_PER_ACCOUNT;
const ZILS_PER_REQUEST = process.env.ZILS_PER_REQUEST;
// const BLOCKS_TO_WAIT = process.env.BLOCKS_TO_WAIT;
const OWNER_PRIVATEKEY = process.env.OWNER_PRIVATEKEY;
const ISOLATED_URL = process.env.ISOLATED_URL;

class Faucet {
  constructor() {
    this.chainId = 222; // chainId of the developer testnet
    this.msgVersion = 1; // current msgVersion
    this.VERSION = bytes.pack(this.chainId, this.msgVersion);
    this.state = [];
    this.getState();

    this.zilliqa = new Zilliqa(ISOLATED_URL);
    this.zilliqa.wallet.addByPrivateKey(OWNER_PRIVATEKEY);
  }

  getState() {
    if (!fs.existsSync('./faucet-state.json')) {
      console.log('Generating state file');
      fs.writeJSONSync('./faucet-state.json', [
        {
          address: 'init',
          block: 0
        }
      ]);
    }

    const stateFile = fs.readJSONSync('./faucet-state.json');
    this.state = stateFile;

    return this.state;
  }

  saveState() {
    fs.writeJSONSync('./faucet-state.json', this.state);
  }

  userAlreadyRegistered(userAddress) {
    return this.state.findIndex((item) => item.address === userAddress) !== -1;
  }

  appendUserToState({ userAddress, block }) {
    this.state.push({ address: userAddress, block });
  }

  async registerUser(userAddress) {
    if (this.userAlreadyRegistered(userAddress)) {
      throw new Error('Address already requested funds.');
    }

    const gasPrice = await this.zilliqa.blockchain.getMinimumGasPrice();
    const myGasPrice = gasPrice.result;

    const tx = this.zilliqa.transactions.new({
      version: this.VERSION,
      toAddr: userAddress,
      amount: new BN(ZILS_PER_ACCOUNT),
      gasPrice: new BN(myGasPrice), // in Qa
      gasLimit: Long.fromNumber(8000)
    });

    const callTx = await this.zilliqa.blockchain.createTransaction(tx);

    if (callTx.receipt.success) {
      this.appendUserToState({ userAddress, block: callTx.receipt.epoch_num });
    }

    return callTx.receipt;
  }

  async requestFunds(userAddress, amount = ZILS_PER_REQUEST) {
    if (this.userAlreadyRegistered(userAddress)) {
      throw new Error('Address already requested funds.');
    }

    const gasPrice = await this.zilliqa.blockchain.getMinimumGasPrice();
    const myGasPrice = gasPrice.result;

    const tx = this.zilliqa.transactions.new({
      version: this.VERSION,
      toAddr: userAddress,
      amount: new BN(amount),
      gasPrice: new BN(myGasPrice), // in Qa
      gasLimit: Long.fromNumber(8000)
    });

    const callTx = await this.zilliqa.blockchain.createTransaction(tx);

    if (callTx.receipt.success) {
      this.appendUserToState({ userAddress, block: callTx.receipt.epoch_num });
    }

    return callTx.receipt;
  }
}

export default Faucet;
