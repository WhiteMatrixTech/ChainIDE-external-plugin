import { cloneDeep } from 'lodash';
import { Observable, Observer } from 'rxjs';
import { BasicWallet } from "@white-matrix/basic-wallet";
import ChainIdeProxyImp from '../../lib/chainIdeProxyImp/ChainIdeProxyImp';
import { ethereum } from './type';
import { convertWei, normalizeArgs } from './utils';
import { IWeb3CallResult } from './type/IInternal';

const MAX_NUM_HANDLE_CONFIRMATION = 5;

const chainIdeProxyImp = new ChainIdeProxyImp({ pluginId: 'simplePlugin' });

chainIdeProxyImp.subscribeEvent('root.pluginLoad', () => {
  console.info('plugin loaded !!!!!!');
});

export default class MetamaskWallet implements BasicWallet {
  web3: any;
  metaMaskEthereum: any;

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

  constructor() {
    this.metaMaskEthereum = (window as any).ethereum;
    this.web3 = new (window as any).Web3((window as any).ethereum);
  };

  /**
   * [init 钱包初始化]
   * @method init
   * @params {onChainChange: listen并获取网络, onAccountChange: listen并获取账户 }
   * @return {[Promise]}
   */
  init(onChainChange: Function, onAccountChange: Function) {
    return new Promise<any>((resolve, reject) => {
      if (!this.web3 || !this.metaMaskEthereum) {
        const error = new Error('MetaMask 未安装');
        reject(error);
      } else {
        resolve(() => this.connectWeb3Service(onChainChange, onAccountChange));
      }
    });
  }

  createAccount() {
    return Observable.create((observer: Observer<any>) => {
      observer.error('请在metamask 插件中新增账户');
      observer.complete();
    });
  }

  fetchNetwork() {
    return Observable.create((observer: Observer<any>) => {
      this.metaMaskEthereum.request({ method: 'eth_requestAccounts' }).then(() => {
        observer.next(this.metaMaskEthereum.chainId);
        observer.complete();
      });
    });
  };

  fetchAccount() {
    return Observable.create((observer: Observer<any>) => {
      this.metaMaskEthereum
        .request({ method: 'eth_accounts' })
        .then(async (accounts: string[]) => {
          const allBalance: string[] = [];
          accounts.forEach((account: string) => {
            const params = [account, 'latest'];
            const quantity = this.metaMaskEthereum.request({
              method: 'eth_getBalance',
              params
            });
            allBalance.push(quantity);
          });
          const accountInfos = (await Promise.all(allBalance)).map(
            (quantity: string, index: number) => {
              return {
                address: accounts[index],
                balance: parseInt(quantity, 16)
              };
            }
          );
          observer.next(accountInfos);
          observer.complete();
        })
        .catch((error: string) => {
          observer.error(error);
        });
    });
  };

  connectWeb3Service = async (
    onChainChange: Function,
    onAccountChange: Function
  ) => {
    try {
      // Will Start the MetaMask Extension
      await this.metaMaskEthereum.request({ method: 'eth_requestAccounts' });
      this.metaMaskEthereum.on('chainChanged', () => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have a very good reason not to.
        onChainChange();
      });
      this.metaMaskEthereum.on('accountsChanged', (accounts: string[]) => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        onAccountChange(accounts);
      });
      onChainChange();
      onAccountChange();
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
      let receiptReceived = false;
      contract
        .deploy({
          data: actionData.solcCompiledOutput.evm.bytecode.object,
          arguments: args
        })
        .send(
          {
            from: actionData.account.address,
            gas: actionData.deployOptions.gasLimit,
            gasPrice: convertWei(
              actionData.deployOptions.value,
              actionData.deployOptions.unit as 'wei' | 'gwei'
            ).toString()
          },
          (error: string, transactionHash: string) => {
            if (error) {
              observer.error(error);
            }
            observer.next({
              type: 'transactionHash',
              data: { transactionHash }
            });
          }
        )
        .on('receipt', (receipt: ethereum.IEthereumReceipt) => {
          if (!receiptReceived) {
            observer.next({ type: 'receipt', data: { receipt } });
            receiptReceived = true;
          }
        })
        .on(
          'confirmation',
          (confirmationNumber: number, receipt: ethereum.IEthereumReceipt) => {
            observer.next({
              type: 'confirmation',
              data: { confirmationNumber, receipt }
            });
            if (confirmationNumber >= MAX_NUM_HANDLE_CONFIRMATION) {
              observer.complete();
            }
          }
        )
        .on('error', (error: string) => {
          observer.error(error);
        });
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
      targetAbiEntry.inputs.forEach((input: any) => {
        functionArguments.push(interactArgs[input.name]);
      });

      const contract = new this.web3.eth.Contract(abi, contractAddress);

      const contractFunction =
        functionArguments.length === 0
          ? contract.methods[functionSignature]()
          : contract.methods[functionSignature](...functionArguments);

      if (
        targetAbiEntry.stateMutability === 'pure' ||
        targetAbiEntry.stateMutability === 'view'
      ) {
        // use call
        contractFunction
          .call({ from: accountAddress })
          .then((result: IWeb3CallResult) => {
            observer.next({ type: 'call/result', data: result });
          });
      } else {
        // use send
        contractFunction
          .send({ from: accountAddress })
          .on('transactionHash', (hash: string) => {
            observer.next({ type: 'send/transactionHash', data: { hash } });
          })
          .on(
            'confirmation',
            (confirmationNumber: number, receipt: ethereum.IEthereumReceipt) => {
              observer.next({
                type: 'send/confirmation',
                data: { confirmationNumber, receipt }
              });
            }
          )
          .on('receipt', (receipt: ethereum.IEthereumReceipt) => {
            observer.next({ type: 'send/receipt', data: { receipt } });
          })
          .on('error', (error: string) => {
            observer.error(error);
          }); // If there's an out of gas error the second parameter is the receipt.
      }
    });
  };
}