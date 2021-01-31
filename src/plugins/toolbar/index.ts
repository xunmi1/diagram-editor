import { ToolbarItem } from '@/main';
import { Plugin } from '@/interfaces';
import { Undo, Redo } from '@icon-park/svg';
import { stringifySVG } from '@/utils';

export const ToolbarKey = {
  HISTORY_UNDO: 'toolbar-undo',
  HISTORY_REDO: 'toolbar-redo',
};

export const historyPlugin: Plugin = editor => {
  const undo = Symbol('undo');
  editor.toolbar.load(
    ToolbarKey.HISTORY_UNDO,
    new ToolbarItem({ icon: stringifySVG(Undo), command: undo, tooltip: '撤销' })
  );
  editor.commands.register<ToolbarItem>(undo, () => {
    editor.graph?.undo();
  });

  const redo = Symbol('redo');
  editor.toolbar.load(
    ToolbarKey.HISTORY_REDO,
    new ToolbarItem({ icon: stringifySVG(Redo), command: redo, tooltip: '重做' })
  );
  editor.commands.register<ToolbarItem>(redo, () => {
    editor.graph?.redo();
  });
};
