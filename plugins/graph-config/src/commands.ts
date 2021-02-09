import { Background } from '@antv/x6/es/registry';
import { DiagramEditor } from '@diagram-editor/diagram-editor';
import type { State } from './index';

export interface GridOptions {
  size?: number;
  visible?: boolean;
}

export interface ScrollerOptions {
  enabled: boolean;
  pannable: boolean;
}

export interface BackgroundOptions extends Background.Options {}

export const CommandId = {
  SET_GRID: Symbol('editor.setGrid'),
  SET_BACKGROUND: Symbol('editor.setBackground'),
  SET_SCROLLER: Symbol('editor.setScroller'),
};

export const registerCommands = (editor: DiagramEditor, state: State) => {
  const setGrid = (options: GridOptions) => {
    const graph = editor.graph;
    if (!graph) return;
    const { size, visible } = options;
    if (size != null && size >= 0) {
      graph.setGridSize(size);
      state.gridSize = size;
    }
    if (visible != null) {
      if (visible) graph.showGrid();
      else graph.hideGrid();
      state.gridVisible = visible;
    }
  };

  const setBackground = (options: BackgroundOptions) => {
    const graph = editor.graph;
    if (!graph) return;
    if (options.color) state.backgroundColor = options.color;
    editor.graph?.drawBackground(options);
  };

  const setScroller = (options: ScrollerOptions) => {
    const graph = editor.graph;
    if (!graph) return;
    const { enabled, pannable } = options;
    if (enabled != null) {
      if (enabled) graph.unlockScroller();
      else graph.lockScroller();
      state.scrollerEnable = enabled;
    }
    if (pannable != null) {
      graph.togglePanning(pannable);
      state.scrollerPannable = pannable;
    }
  };

  editor.commands.register(CommandId.SET_GRID, setGrid);
  editor.commands.register(CommandId.SET_BACKGROUND, setBackground);
  editor.commands.register(CommandId.SET_SCROLLER, setScroller);
};
