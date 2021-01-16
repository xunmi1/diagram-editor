import { Plugin } from '@/interfaces';
import NodeBase from '@/plugins/views/NodeBase';

export const enum CellBarKey {
  NODE_BASE = 'NODE_BASE',
  NODE_COMBINATION = 'NODE_COMBINATION',
}

export const builtInPlugin: Plugin = editor => {
  editor.registerCellBar(CellBarKey.NODE_BASE, new NodeBase());
  editor.registerCellBar(CellBarKey.NODE_COMBINATION, new NodeBase());
};
