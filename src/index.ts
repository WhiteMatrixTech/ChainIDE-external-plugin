import MetamaskWallet from "./metamaskService/MetamaskWallet"

export enum PluginMode {
    REMOTE = 'remote',
    DYNAMIC = 'dynamic'
}

export enum PluginType {
    view = 'view',
    server = 'server'
}

export enum PluginViewType {
    iframe = 'iframe',
    panel = 'panel',
    none = 'none'
}

export enum PluginPosition {
    left = 'left',
    center = 'center',
    right = 'right',
    none = 'none'
}

export default function pluginInit() {
    return {
        pluginId: 'simplePlugin',
        moduleName: 'simplePlugin',
        version: '0.0.1',
        type: PluginType.server,
        viewType: PluginViewType.none,
        position: PluginPosition.none,
        mode: PluginMode.REMOTE,
        content: MetamaskWallet,
        active: true,
        description: {
            title: 'simplePlugin',
            description: 'simplePlugin des',
        },
        menuIcon: {
            title: 'simplePlugin',
            // use icon clode from https://developer.microsoft.com/en-us/fluentui#/controls/web/icon
            iconCode: 'WebAppBuilderFragment'
        },
        extra: {
            isWallet: true
        }
    }
}