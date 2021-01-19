import type { GraphOptions } from '@/interfaces';

export const defaultOptions: GraphOptions = {
  grid: {
    size: 10, // 网格大小 10px
    visible: true, // 绘制网格，默认绘制 dot 类型网格
  },
  snapline: {
    enabled: true,
    tolerance: 10,
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
  history: true,
  selecting: {
    enabled: true,
    multiple: true,
    rubberband: true,
    movable: true,
    showNodeSelectionBox: true,
    showEdgeSelectionBox: true,
  },
  clipboard: {
    enabled: true,
  },
  keyboard: {
    enabled: true,
  },
  resizing: {
    enabled: true,
  },
  rotating: {
    enabled: true,
  },
  connecting: {
    anchor: 'center',
    connectionPoint: 'anchor',
    allowBlank: false,
    highlight: true,
    snap: true,
  },
  highlighting: {
    magnetAvailable: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: {
          strokeWidth: 4,
          stroke: 'rgba(223,234,255)',
        },
      },
    },
  },
};
