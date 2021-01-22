import { Plugin } from '@/interfaces';
import NodeBasePanel from './views/NodeBasePanel';
import GraphConfigPanel from './views/GraphConfigPanel';
import NodeConfigPanel from './views/NodeConfigPanel';

export const enum ExplorerKey {
  NODE_BASE = 'NODE_BASE',
  NODE_COMBINATION = 'NODE_COMBINATION',
}

export const enum ControllerKey {
  GRAPH = 'GRAPH',
  NODE = 'NODE',
}

export const builtInPlugin: Plugin = editor => {
  editor.explorer.load(ExplorerKey.NODE_BASE, NodeBasePanel);

  editor.controller.load(ControllerKey.GRAPH, GraphConfigPanel);
  editor.controller.load(ControllerKey.NODE, NodeConfigPanel);
};
