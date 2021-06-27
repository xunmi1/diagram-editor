import { Plugin, StatusbarItem } from '@diagram-editor/diagram-editor';

export interface PluginOptions {
  key: string;
}

export const nodeCountPlugin =
  (options: PluginOptions): Plugin =>
  editor => {
    const item = new StatusbarItem();
    editor.statusbar.load(options.key, item);
    const change = () => {
      const count = editor.graph?.getNodes().length;
      item.text = `节点: ${count}`;
      item.tooltip = `当前画布节点数量: ${count}`;
    };
    editor.onDidMount(graph => {
      change();
      graph.on('node:added', change);
      graph.on('node:removed', change);
    });
  };

export const edgeCountPlugin =
  (options: PluginOptions): Plugin =>
  editor => {
    const item = new StatusbarItem();
    editor.statusbar.load(options.key, item);
    const change = () => {
      const count = editor.graph?.getEdges().length;
      item.text = `边: ${count}`;
      item.tooltip = `当前画布边的数量: ${count}`;
    };
    editor.onDidMount(graph => {
      change();
      graph.on('edge:added', change);
      graph.on('edge:removed', change);
    });
  };
