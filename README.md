#### @white-matrix/chainide-proxy-implements

##### 引入方式
- <script> 标签引入
- npm i @white-matrix/chainide-proxy-implements 通过 import 方式引入

#### config.js

```typescript
import chainIdeProxyImpl from '@white-matrix/chainide-proxy-implements';
import { ReactNode } from 'react';
import { IIconProps } from 'office-ui-fabric-react';

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

export interface PluginMenuIcon {
  title: string;
  // you can use iconCode from https://developer.microsoft.com/en-us/fluentui#/controls/web/icon
  iconCode: string;
  iconProps: IIconProps;
}

export type PluginContent = string | ReactNode | null;

export interface BasePluginOption {
  pluginId: string;
  moduleName: string;
  version: string;
  type: PluginType;
  viewType: PluginViewType;
  position: PluginPosition;
  mode: PluginMode;
  content: PluginContent;
  active: boolean;
  description: {
    title: string;
    icon?: string;
    description?: string;
  };
  peerDependencies?: {
    [name: string]: string;
  };
}

export interface BaseIframePluginOption extends BasePluginOption {
  type: typeof PluginType.view;
  viewType: typeof PluginViewType.iframe;
  content: string;
}

export interface LeftPluginIframeOption extends BaseIframePluginOption {
  position: typeof PluginPosition.left;
  menuIcon: PluginMenuIcon;
}

export interface CenterPluginIframeOption extends BaseIframePluginOption {
  position: typeof PluginPosition.center;
}

export type PluginOption = LeftPluginIframeOption | CenterPluginIframeOption;

const loadOptions = (pluginOption: PluginOption) => {
  const commandFunc = () => {
    // chainIdeProxyImpl.(eg: open webview name with data or send action); add View
    // register func
    // addFileView provide ID
    // openFile
  };

  return {
    ...pluginOption,
    panelOptions: {
      description: '',
      actions: [
        {
          name: '',
          command: commandFunc
        }
      ]
    }
  };
};
```

#### iframe example

```typescript
import ChainIdeProxyImp from '@white-matrix/chainide-proxy-implements';

/**
 * subscribe IDE default event
 * eg:
 * CREATE_DONE
 * REMOVE_DONE
 * MOVE_DONE
 * RENAME_DONE
 * CHANGE_CONTENT_DONE
 */
const chainIdeProxyImp = new ChainIdeProxyImp({ pluginId: 'plugin1' });

/**
 * subscribe custom event you need
 * in plugin1 sub custom event
 */
chainIdeProxyImp.subscribeEvent('plugin need update', ({ data }) =>
  console.info('update');
);

/**
 * in plugin2 pub event
 */
chainIdeProxyImp.publishEvent('plugin need update', data);

chainIdeProxyImp.unsubscribeEvent('plugin need update');

/**
	* Support for registering async functions
	*/
const callable = (data) => {}
chainIdeProxyImp.registerApiFunction('pluginId', 'functionName', callable);

/**
 * you can call default api function
 * eg:getFileTree,getFile,getPath,getRoot,getChildren,openTab...
 * or use function custom register
 */
chainIdeProxyImp.callApiFunction('pluginId', 'functionName', data).then(data => {
  console.info(data)
});
```
