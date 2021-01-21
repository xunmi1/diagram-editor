import { Shape, Node } from '@antv/x6';
import { merge } from '@/utils';

export class BasicRect extends Shape.Rect {
  constructor(options?: Node.Metadata) {
    const defaultOptions = {
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
