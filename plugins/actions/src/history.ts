import { ToolbarItem, MenubarItem, Plugin } from '@diagram-editor/diagram-editor';
import { Undo, Redo } from '@icon-park/svg';
import { stringifySVG } from '@diagram-editor/shared';
import { TopMenuKey, ActionKey } from './constants';

export const HistoryCommandId = {
  UNDO: Symbol('undo'),
  REDO: Symbol('redo'),
};

export const historyPlugin: Plugin = editor => {
  const undoAction = () => {
    editor.graph?.undo();
  };
  const redoAction = () => {
    editor.graph?.redo();
  };

  const historyMeta = [
    {
      key: ActionKey.UNDO,
      text: '撤销',
      command: HistoryCommandId.UNDO,
      icon: stringifySVG(Undo),
      hotKey: 'Ctrl+Z',
      action: undoAction,
    },
    {
      key: ActionKey.REDO,
      text: '恢复',
      command: HistoryCommandId.REDO,
      icon: stringifySVG(Redo),
      hotKey: 'Ctrl+Y',
      action: redoAction,
    },
  ];

  const { menubar, toolbar, commands } = editor;
  const parentKey = TopMenuKey.EDIT;

  historyMeta.forEach(meta => {
    const menubarItem = new MenubarItem({ text: meta.text, command: meta.command, extra: meta.hotKey });
    menubar.load(meta.key, menubarItem, parentKey);

    const tooltip = `${meta.text} (${meta.hotKey})`;
    const toolbarItem = new ToolbarItem({ icon: meta.icon, command: meta.command, tooltip });
    toolbar.load(meta.key, toolbarItem);

    commands.register(meta.command, meta.action);
  });

  editor.onDidMount(graph => {
    historyMeta.forEach(meta => {
      graph.bindKey(meta.hotKey, meta.action);
    });
  });
};
