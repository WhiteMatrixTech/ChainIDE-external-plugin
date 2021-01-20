/**
 * Interface for web3.eth event callback interface
 */

export interface IWeb3CallResult {
  code: number;
  data: string;
}

export interface IEvmAccount {
  address: string;
  balance: string;
}