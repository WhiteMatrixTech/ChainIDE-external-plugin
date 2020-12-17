import { PluginOptions } from './type';
export default class ChainIdeProxyImp {
    pluginOptions: PluginOptions;
    events: Array<{
        eventName: string;
        callback: Function;
    }>;
    registerApiFunctions: Array<{
        functionName: string;
        callback: Function;
    }>;
    constructor(pluginOptions: PluginOptions);
    getSubscribeCallbackByEventname(eventname: string): false | Function;
    getRegisterApiFunctionByEventname(functionName: string): false | Function;
    subscribeEvent(eventName: string, cb: Function): void;
    publishEvent<T>(eventName: string, data: T): void;
    unsubscribeEvent(eventName: string): void;
    registerApiFunction(functionName: string, cb: (data?: any) => any): void;
    callApiFunction<T>(targetPluginId: string, functionName: string, data: T): Promise<unknown>;
}
