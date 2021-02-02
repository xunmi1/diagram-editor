import { Plugin } from '@/interfaces';
import NodeBasePanel from './views/NodeBasePanel';
import GraphConfigPanel from './views/GraphConfigPanel';
import { installMenubar } from './menubar';
import { nodeCountPlugin, edgeCountPlugin } from './statusbar';
import { historyPlugin } from './toolbar';
import { contextMenuPlugin } from '@/plugins/contextMenu';

export * from './statusbar';

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
  editor.explorer.load(ExplorerKey.NODE_BASE, new NodeBasePanel());
  editor.controller.load(ControllerKey.GRAPH, graphConfigPanel);
  installMenubar(editor);
  nodeCountPlugin(editor);
  edgeCountPlugin(editor);
  historyPlugin(editor);
  contextMenuPlugin(editor);
};
