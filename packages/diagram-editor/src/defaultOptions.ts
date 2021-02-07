import type { EditorOptions } from '@/interfaces';

const DEFAULT_SIZE = 10;

export const defaultOptions: EditorOptions = {
  explorer: true,
  controller: true,
  menubar: true,
  toolbar: true,
  statusbar: true,
  contextMenu: true,

  graph: {
    grid: {
      size: DEFAULT_SIZE,
      visible: true,
    },
    autoResize: true,
    snapline: {
      enabled: true,
      tolerance: DEFAULT_SIZE,
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
    connecting: {
      snap: {
        radius: DEFAULT_SIZE * 1.2,
      },
      allowBlank: false,
      allowLoop: false,
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
  },
};
