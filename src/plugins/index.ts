import { Plugin } from '@/interfaces';
import NodeBasePanel from './views/NodeBasePanel';
import GraphConfigPanel from './views/GraphConfigPanel';

export const enum ExplorerKey {
  NODE_BASE = 'NODE_BASE',
  NODE_COMBINATION = 'NODE_COMBINATION',
}

export const enum ControllerKey {
  GRAPH = 'GRAPH',
  NODE = 'NODE',
}

export const builtInPlugin: Plugin = editor => {
  const graphConfigPanel = new GraphConfigPanel();
  graphConfigPanel.onWillMount(a => console.log(a));
  editor.explorer.load(ExplorerKey.NODE_BASE, new NodeBasePanel());

  editor.controller.load(ControllerKey.GRAPH, graphConfigPanel);
};
