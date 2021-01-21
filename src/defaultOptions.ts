import type { GraphOptions } from '@/interfaces';

export const defaultOptions: GraphOptions = {
  grid: {
    size: 10,
    visible: true,
  },
  autoResize: true,
  snapline: {
    enabled: true,
    tolerance: 10,
  },
  background: {
    color: 'rgba(255, 255, 255, 1)',
  },
  // 必须先启用才能禁用
  scroller: {
    enabled: true,
    pannable: false,
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl'],
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
          stroke: 'rgba(223, 234, 255)',
        },
      },
    },
  },
};
