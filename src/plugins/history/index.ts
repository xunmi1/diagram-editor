import { ToolbarItem, MenubarItem } from '@/main';
import { Plugin } from '@/interfaces';
import { Undo, Redo } from '@icon-park/svg';
import { stringifySVG } from '@/utils';

import { TopMenuKey } from '../topMenu';

export const enum HistoryKey {
  UNDO = 'history-undo',
  REDO = 'history-redo',
}

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
      key: HistoryKey.UNDO,
      text: '撤销',
      command: HistoryCommandId.UNDO,
      icon: stringifySVG(Undo),
      hotKey: 'Ctrl+Z',
      action: undoAction,
    },
    {
      key: HistoryKey.REDO,
      text: '恢复',
      command: HistoryCommandId.REDO,
      icon: stringifySVG(Redo),
      hotKey: 'Ctrl+Y',
      action: redoAction,
    },
  ];

  const { menubar, toolbar, commands } = editor;

  historyMeta.forEach(meta => {
    const toolbarItem = new ToolbarItem({ icon: meta.icon, command: meta.command, tooltip: meta.text });
    toolbar.load(meta.key, toolbarItem);
    const menubarItem = new MenubarItem({ text: meta.text, command: meta.command, extra: meta.hotKey });
    menubar.load(meta.key, menubarItem, TopMenuKey.EDIT);

    commands.register(meta.command, meta.action);
  });

  editor.onDidMount(graph => {
    historyMeta.forEach(meta => {
      graph.bindKey(meta.hotKey, meta.action);
    });
  });
};
