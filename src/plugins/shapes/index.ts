import { Shape, Node } from '@antv/x6';
import { merge } from '@/utils';

const POSITION_START_X = 12;
const POSITION_START_Y = 12;

export class BasicRect extends Shape.Rect {
  constructor(options?: Node.Metadata) {
    const defaultOptions = {
      x: POSITION_START_X,
      y: POSITION_START_Y,
      width: 80,
      height: 40,
      attrs: {
        label: {
          text: '节点',
        },
      },
    };

    super(merge(defaultOptions, options));
  }
}
