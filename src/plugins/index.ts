import { Plugin } from '@/interfaces';
import NodeBase from './cellViews/NodeBase';
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
  editor.explorer.load(ExplorerKey.NODE_BASE, NodeBase);
  editor.explorer.load(ExplorerKey.NODE_COMBINATION, NodeBase);

  editor.controller.load(ControllerKey.GRAPH, GraphConfigPanel);
};
