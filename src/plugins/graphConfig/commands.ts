import { BackgroundManager as Background } from '@antv/x6/es/graph/background';
import { DiagramEditor } from '@/interfaces';
import type { State } from './index';

interface GridOptions {
  size?: number;
  visible?: boolean;
}

interface ScrollerOptions {
  enabled: boolean;
  pannable: boolean;
}

export const registerCommands = (editor: DiagramEditor, state: State) => {
  const setGrid = (options: GridOptions) => {
    const graph = editor.graph;
    if (!graph) return;
    const { size, visible } = options;
    if (size != null) {
      graph.setGridSize(Math.max(0, size));
      if (graph.isSnaplineEnabled()) graph.setSnaplineTolerance(size);
      state.gridSize = size;
    }
    if (visible != null) {
      if (visible) graph.showGrid();
      else graph.hideGrid();
      state.gridVisible = visible;
    }
  };

  const setBackground = (options: Background.Options) => {
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

  editor.commands.register('editor.setGrid', setGrid);
  editor.commands.register('editor.setBackground', setBackground);
  editor.commands.register('editor.setScroller', setScroller);
};
