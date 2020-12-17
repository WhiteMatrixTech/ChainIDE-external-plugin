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
        type: PluginType.view,
        viewType: PluginViewType.iframe,
        position: PluginPosition.center,
        mode: PluginMode.REMOTE,
        content: 'http://127.0.0.1:8081/plugin1.html',
        active: true,
        description: {
            title: 'plugin1',
            description: 'plugin1 des',
        },
        // menuIcon: {
        //     title: 'plugin1',
        //     use icon clode from https://developer.microsoft.com/en-us/fluentui#/controls/web/icon
        //     iconCode: 'WebAppBuilderFragment'
        // },
    }
}