import { Plugin } from '@/interfaces';
import NodeBasePanel from './views/NodeBasePanel';
import GraphConfigPanel from './views/GraphConfigPanel';

export const enum ExplorerKey {
  NODE_BASE = 'NODE_BASE',
  NODE_COMBINATION = 'NODE_COMBINATION',
}

export const enum ControllerKey {
  GRAPH = 'GRAPH',
  NODE_STYLE = 'NODE_STYLE',
}

export const builtInPlugin: Plugin = editor => {
  editor.explorer.load(ExplorerKey.NODE_BASE, NodeBasePanel);

  editor.controller.load(ControllerKey.GRAPH, GraphConfigPanel);
};
