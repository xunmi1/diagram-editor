import { Plugin } from '@/interfaces';
import { ShapeType } from '@/constants';
import NodeBase from '@/plugins/views/NodeBase';

export const builtInPlugin: Plugin = editor => {
  editor.registerCellBar(ShapeType.NODE_BASE, new NodeBase());
  editor.registerCellBar(ShapeType.NODE_COMBINATION, new NodeBase());
};
