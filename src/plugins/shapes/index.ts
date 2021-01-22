import { Shape, Node } from '@antv/x6';
import { merge } from '@/utils';

export class BasicRect extends Shape.Rect {
  constructor(options?: Node.Metadata) {
    const defaultOptions = {
      width: 80,
      height: 40,
      label: '基本节点',
      ports: {
        groups: {
          in: {
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden',
                },
              },
            },
            position: 'top',
          },
          out: {
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
            position: 'bottom',
          },
        },
        items: [
          {
            group: 'in',
          },
          {
            group: 'out',
          },
        ],
      },
    };

    super(merge(defaultOptions, options));
  }
}
