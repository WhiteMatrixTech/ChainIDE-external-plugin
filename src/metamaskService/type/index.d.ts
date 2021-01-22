export declare namespace ethereum {
  const compiledFileExt = '.sol.compiled';
  const deployedFileExt = '.eth.deployed';

  interface IEthereumReceipt {
    blockHash: string;
    blockNumber: number;
    contractAddress: string;
    cumulativeGasUsed: number;
    from: string;
    gasUsed: string;
    transacitonHash: string;
  }

  interface IEthereumTrasactions {
    [transactionHash: string]: {
      confirmationNumber: number;
      receipt?: IEthereumReceipt;
    };
  }

  interface IEthereumAccount {
    address: string;
    balance: number;
  }

  /**
   *  CompilerInput follows tha same format of solcjs
   *  https://github.com/ethereum/solc-js
   *  https://solidity.readthedocs.io/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
   */
  interface ICompilerInput {
    language: 'Solidity';
    settings: any;
    sources: any;
  }

  interface ICompileContractActionData {
    compileArgs: ICompilerInput;
    fileId: string;
  }

  /*
   * item: according to new filesystem data structure
   *     code: raw content in string
   * path: a string list
   */
  interface ICompiledContract {
    // solcRawOutput: ISolcRawOutput;
    contractName: string;
    fileName: string;
    solcSelectedContractOutput: ISolcSelectedContractOuput;
    path: string[];
  }

  interface IEthereumAbiInput {
    name: string;
    type: string;
    components: any;
  }

  interface IEthereumAbiItem {
    type: string;
    name: string;
    inputs: IEthereumAbiInput[];
    outputs: any[];
    stateMutability: string;
    payable: boolean;
    constant: boolean;
  }

  interface ISolcSelectedContractOuput {
    abi: IEthereumAbiItem[];
    evm: {
      bytecode: {
        object: string;
        opcodes: string;
        sourceMap: string;
      };
      gasEstimation: {
        creation: {
          codeDepositCost: string;
          executionCost: string;
          totalCost: string;
        };
      };
    };
  }

  interface ISolcRawOutput {
    contracts: {
      [fileName: string]: {
        [contractName: string]: ISolcSelectedContractOuput;
      };
    };
    errors: any;
    sources: any;
  }

  /**
   *  CompilerOutput
   *  if code = 0 means no errros
   *    data: follows tha same format of solcjs https://github.com/ethereum/solc-js
   *    https://solidity.readthedocs.io/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
   *  elif code = 1 means something is wrong
   *    data: error message
   */
  interface ICompileContractResult {
    code: number;
    data: ISolcRawOutput | any;
  }

  interface ICompileContractSuccessActionData {
    result: ICompileContractResult;
    fileId: string;
  }

  /**
   * Deploy options passed to Metamask
   * unit only support 'wei' and 'gwei'
   */
  interface IDeployOptions {
    gasLimit: number;
    value: number;
    unit: string;
  }

  interface IDeployContractActionData {
    contractName: string;
    solcCompiledOutput: ISolcSelectedContractOuput;
    account: IEthereumAccount;
    deployOptions: IDeployOptions;
    constructorArgs: any;
    path: string[];
  }

  /**
   * item: according to new filesystem data structure
   *    code: raw content in string
   */
  interface IDeployedContract {
    deployedInfo: IDeployedInfo;
    path: string[];
  }

  interface IDeployedInfo {
    deployActionData: IDeployContractActionData;
    transacitonHash: string;
    confirmed: number;
    receipt: any;
  }

  interface IInteractContractActionData {
    interactArgs: any;
    contractAddress: string;
    abiEntryIdx: number;
    accountAddress: string;
    abi: IEthereumAbiItem[];
  }

  interface IInteractContractCallSuccessActionData {
    contractAddress;
    abiEntryIdx;
    result;
  }
}
