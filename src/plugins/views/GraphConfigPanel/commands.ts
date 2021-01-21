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

const setGridVisible = (editor: DiagramEditor, visible: boolean) => {
  if (visible) editor.graph?.showGrid();
  else editor.graph?.hideGrid();
};

const setScrollerEnable = (editor: DiagramEditor, enable: boolean) => {
  if (enable) editor.graph?.unlockScroller();
  else editor.graph?.lockScroller();
};

export const registerCommands = (editor: DiagramEditor, state: State) => {
  const setGrid = (options: GridOptions) => {
    const { size, visible } = options;
    if (size != null) {
      state.gridSize = size;
      editor.graph?.setGridSize(Math.max(0, size));
    }
    if (visible != null) {
      state.gridVisible = visible;
      setGridVisible(editor, visible);
    }
  };

  const setBackground = (options: Background.Options) => {
    const { color } = options;
    if (color) state.backgroundColor = color;
    editor.graph?.drawBackground(options);
  };

  const setScroller = (options: ScrollerOptions) => {
    const { enabled, pannable } = options;

    if (enabled != null) {
      state.scrollerEnable = enabled;
      setScrollerEnable(editor, enabled);
    }
    if (pannable != null) {
      state.scrollerPannable = pannable;
      editor.graph?.togglePanning(pannable);
    }
  };

  editor.commands.register('editor.setGrid', setGrid);
  editor.commands.register('editor.setBackground', setBackground);
  editor.commands.register('editor.setScroller', setScroller);
};
