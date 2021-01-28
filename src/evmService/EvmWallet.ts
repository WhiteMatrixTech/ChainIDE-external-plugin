import Web3 from 'web3';
import Buffer from 'buffer';
import { cloneDeep } from 'lodash';
import { Observable, Observer } from 'rxjs';
import { BasicWallet } from "@white-matrix/basic-wallet";
import { ethereum } from './type';
import { convertWei, normalizeArgs } from './utils';
import { IEvmAccount } from './type/IInternal';
import devkitVm from './evmProvider/src/evm';
import ChainIdeProxyImp from '@white-matrix/chainide-proxy-implements';

const Tx = require('ethereumjs-tx').Transaction;

export default class EvmWallet implements BasicWallet {
  web3: any;
  devkitVm: any;

  accounts: IEvmAccount[] = [];
  network: string = 'Evm Default Network';

  bufferKeys: { [key: string]: Buffer } = {};

  _gasPrice = '0x3B9ACA00';
  _gasLimit = '0x2DC6C0';

  static pluginId: 'evmWalletPlugin';

  /**
 * [instance  当前实例]
 * @type {this}
 */
  static instance: any
  /**
   * [getInstance 获取单例]
   * @method getInstance
   * @return {[type]}    [description]
   */
  static getInstance() {
    if (false === this.instance instanceof this) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   * [destroyInstance 销毁实例]
   * @method destroyInstance
   * @return {[type]}    [description]
   */
  static destroyInstance() {
    this.instance = null;
  }

  constructor() {
    let provider;
    devkitVm.init();
    provider = new devkitVm.Provider(devkitVm);

    this.web3 = new Web3(provider);
    this.devkitVm = this.web3.currentProvider.devkitVm;
    this.createAccount();
  };

  /**
   * [init 钱包初始化]
   * @method init
   * @params {onChainChange: listen并获取网络, onAccountChange: listen并获取账户 }
   * @return {[Promise]} 
   */
  init(onChainChangeEvent: string, onAccountChangeEvent: string) {
    return new Promise<any>((resolve, reject) => {
      if (!this.web3 || !this.devkitVm) {
        const error = new Error('EVM 初始化失败');
        reject(error);
      } else {
        resolve(() => this.connectWeb3Service(onChainChangeEvent, onAccountChangeEvent));
      }
    });
  }

  createAccount() {
    let balance = '0x0';
    const { address, privateKey } = this.web3.eth.accounts.create();
    this.devkitVm.setBalance(address, "0x56bc75e2d63100000");
    this.devkitVm.getBalance(address, (err: string, bal: string) => {
      if (err) {
        console.log('getBalance error', err);
        balance = '0x0';
      }
      balance = bal;
    });

    const account = {
      address,
      balance: balance,
    }
    const bufferKey = Buffer.Buffer.from(privateKey.replace("0x", ""), "hex")
    this.accounts.push(account);
    this.bufferKeys[address as string] = bufferKey;
  }

  fetchNetwork() {
    return Observable.create((observer: Observer<any>) => {
      observer.next(this.network);
      observer.complete();
    });
  };

  fetchAccount() {
    return Observable.create((observer: Observer<any>) => {
      observer.next(this.accounts);
      observer.complete();
    });
  };

  connectWeb3Service = async (
    onChainChangeEvent: string,
    onAccountChangeEvent: string
  ) => {
    try {
      const newChainIdeProxyImp = new ChainIdeProxyImp({ pluginId: EvmWallet.pluginId });
      newChainIdeProxyImp.publishEvent(onChainChangeEvent, '');
      newChainIdeProxyImp.publishEvent(onAccountChangeEvent, '');
    } catch (error) {
      console.warn(error);
    }
  };

  deployContract(actionData: ethereum.IDeployContractActionData) {
    return Observable.create((observer: Observer<any>) => {
      const { abi } = actionData.solcCompiledOutput;
      const args = normalizeArgs(
        actionData.solcCompiledOutput,
        actionData.constructorArgs
      );

      const contract = new this.web3.eth.Contract(cloneDeep(abi));
      let deployedContract: { encodeABI: () => any; };
      try {
        deployedContract = contract.deploy({
          data: actionData.solcCompiledOutput.evm.bytecode.object,
          arguments: args
        });
      } catch (error) {
        observer.error(error);
      }

      this.getNonce(actionData.account.address).then(nonce => {
        // sign transaction
        let rawTx = {
          nonce: this.web3.utils.toHex(nonce),
          value: "0x00",
          data: deployedContract.encodeABI(),
          from: actionData.account.address,
          gasLimit: this.web3.utils.toHex(actionData.deployOptions.gasLimit),
          gasPrice: this.web3.utils.toHex(convertWei(
            actionData.deployOptions.value,
            actionData.deployOptions.unit as 'wei' | 'gwei'
          ).toString()),
        };
        const tx = new Tx(rawTx);
        tx.sign(this.bufferKeys[actionData.account.address]);
        return tx;
      })
        .then(tx => this.sendInternalTransaction(tx))
        .then((result: any) => {
          observer.next({
            type: 'transactionHash',
            data: { transactionHash: result.hash }
          });
          let transactionHash = result.hash;
          // on receipt
          this.getReceipt(transactionHash).then((receipt: any) => {
            if (receipt == null || receipt.blockHash == null) {
              setTimeout(() => this.getReceipt(transactionHash), 1000);
            } else {
              observer.next({ type: 'receipt', data: { receipt } });
              observer.complete();
            }
          }).catch(error => observer.error(error));
        })
        .catch(err => observer.error({ msg: `${err}\n`, channel: 2 }));
    });
  };

  interactContract(interactContractActionData: ethereum.IInteractContractActionData) {
    return Observable.create((observer: Observer<any>) => {
      const {
        abi,
        abiEntryIdx,
        accountAddress,
        interactArgs,
        contractAddress
      } = interactContractActionData;
      const targetAbiEntry = abi[abiEntryIdx];
      const functionArguments: string[] = [];
      const functionSignature = targetAbiEntry.name;
      targetAbiEntry.inputs.forEach((input) => {
        functionArguments.push(interactArgs[input.name]);
      });

      const contract = new this.web3.eth.Contract(abi, contractAddress);
      const contractFunction =
        functionArguments.length === 0
          ? contract.methods[functionSignature]()
          : contract.methods[functionSignature](...functionArguments);

      let rawTx = {
        value: "0x00",
        data: contractFunction.encodeABI(),
        from: accountAddress,
        to: contractAddress,
        gasPrice: this._gasPrice,
        gasLimit: this._gasLimit,
        nonce: '0x0'
      };

      if (
        targetAbiEntry.stateMutability === 'pure' ||
        targetAbiEntry.stateMutability === 'view'
      ) {
        // use call
        this.getNonce(accountAddress).then(nonce => {
          rawTx = {
            ...rawTx,
            nonce: this.stringToHex(nonce as string),
          };
          this.call(rawTx).then(result => {
            observer.next({ type: 'call/result', data: result });
          }).catch(error => observer.error(error));
        })
      } else {
        // use send
        this.getNonce(accountAddress).then(nonce => {
          // sign transaction
          rawTx = {
            ...rawTx,
            nonce: this.stringToHex(nonce as string),
          };
          const tx = new Tx(rawTx);
          tx.sign(this.bufferKeys[accountAddress]);
          return tx;
        })
          .then(tx => this.sendInternalTransaction(tx))
          .then((result: any) => {
            let transactionHash = result.hash;
            observer.next({ type: 'send/transactionHash', data: { hash: transactionHash } });

            // on receipt
            this.getReceipt(transactionHash).then((receipt: any) => {
              if (receipt == null || receipt.blockHash == null) {
                setTimeout(() => this.getReceipt(transactionHash), 1000);
              } else {
                observer.next({ type: 'send/receipt', data: { receipt } });
                observer.complete();
              }
            }).catch(error => observer.error(error));
          })
          .catch(error => observer.error(error));
      }
    });
  }

  private stringToHex(str: string | number) {
    return this.web3.utils.toHex(str)
  }

  private getNonce(address: string) {
    return new Promise((resolve, reject) => {
      this.devkitVm.getTransactionCount(address, (err: any, res: any) => {
        if (err == null) {
          resolve(res);
        } else {
          reject(`Could not get nonce for address ${address}.`);
        }
      });
    });
  }

  private sendInternalTransaction(tx: any) {
    return new Promise<any>((resolve, reject) => {
      this.devkitVm.sendRawTransaction(
        '0x' + tx.serialize().toString('hex'),
        (err: string, hash: string) => {
          if (err) {
            reject(err);
          } else {
            resolve({ hash, tx });
          }
        }
      );
    });
  }

  private getReceipt(hash: string) {
    return new Promise<any>((resolve, reject) => {
      const receipt = this.devkitVm.getTransactionReceipt(hash);

      resolve(receipt)

    });
  };

  private call(rawTx: object) {
    return new Promise<any>((resolve, reject) => {
      this.devkitVm.call(rawTx, (err: any, result: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    });
  }

}