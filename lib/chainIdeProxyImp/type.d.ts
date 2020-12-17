export interface PluginOptions {
    pluginId: string;
}
export declare enum PluginSource {
    plugin = "plugin",
    ide = "ide"
}
export interface BaseMessage {
    success: boolean;
    source: PluginSource;
}
export declare type SendMessage = BaseMessage;
export declare type ReceiveMessage = BaseMessage;
export declare enum PluginReceiveMessageAction {
    subscribeEvent = "subscribeEvent",
    publishEvent = "publishEvent",
    unsubscribeEvent = "unsubscribeEvent",
    registerApiFunction = "registerApiFunction",
    registerApiFunctionReturn = "registerApiFunctionReturn",
    callApiFunction = "callApiFunction"
}
export interface MessageEvent<T = any> extends Event {
    readonly data: T;
    readonly origin: string;
    readonly ports: any;
    readonly source: Window;
    initMessageEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, dataArg: T, originArg: string, lastEventIdArg: string, sourceArg: Window): void;
}
