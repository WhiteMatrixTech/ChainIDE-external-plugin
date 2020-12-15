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
        pluginId: 'plugin1',
        moduleName: 'MyLibrary',
        version: '0.0.1',
        type: PluginType.view,
        viewType: PluginViewType.iframe,
        position: PluginPosition.left,
        mode: PluginMode.REMOTE,
        content: 'http://127.0.0.1:8081/plugin1.html',
        active: true,
        description: {
            icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
            title: 'plugin1',
            description: 'plugin1 des',
        },
        peerDependencies: {
            plugin2: 'plugin2.js'
        },
        menuIcon: {
            title: 'plugin1',
            iconCode: 'WebAppBuilderFragment'
        },
    }
}