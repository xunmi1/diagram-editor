import { Plugin } from '@/interfaces';
import NodeBase from './cellViews/NodeBase';
import NodeStyle from './configViews/NodeStyle';
import EdgeStyle from './configViews/EdgeStyle';

export const enum CellBarKey {
  NODE_BASE = 'NODE_BASE',
  NODE_COMBINATION = 'NODE_COMBINATION',
}

export const enum ConfigBarKey {
  NODE_STYLE = 'NODE_STYLE',
  NODE_BASE = 'NODE_BASE',
}

export const builtInPlugin: Plugin = editor => {
  editor.loadCellBar(CellBarKey.NODE_BASE, NodeBase);
  editor.loadCellBar(CellBarKey.NODE_COMBINATION, NodeBase);
  editor.loadConfigBar(ConfigBarKey.NODE_STYLE, NodeStyle);
  editor.loadConfigBar(ConfigBarKey.NODE_BASE, EdgeStyle);
};
