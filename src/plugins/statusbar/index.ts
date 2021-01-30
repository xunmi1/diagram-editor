import { Plugin } from '@/interfaces';
import { StatusbarItem } from '@/statusbar';

export const StatusbarKey = {
  NODE_COUNT: 'statusbar-cell-count',
  EDGE_COUNT: 'statusbar-edge-count',
};

export const nodeCountPlugin: Plugin = editor => {
  const item = new StatusbarItem();
  editor.statusbar.load(StatusbarKey.NODE_COUNT, item);
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

export const edgeCountPlugin: Plugin = editor => {
  const item = new StatusbarItem();
  editor.statusbar.load(StatusbarKey.EDGE_COUNT, item);
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
