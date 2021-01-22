import { ethereum } from '../type';

export function generateUniqueId() {
    return Math.random().toString(36).substr(2, 16);
}

export function convertWei(value: number, unit: 'wei' | 'gwei'): number {
    const unitOptions = { wei: 1, gwei: 1000000000 };
    return value * unitOptions[unit];
}

export function normalizeArgs(
    compiledInfo: ethereum.ISolcSelectedContractOuput,
    deployArgs: any
): any[] {
    const ret: any[] = [];
    // TODO(Alvin): add abi interface later
    compiledInfo.abi.forEach((entry: any) => {
        if (entry.type === 'constructor') {
            (entry.inputs as any[]).forEach((arg: any) => {
                ret.push(deployArgs[arg.name]);
            });
        }
    });
    return ret;
}

