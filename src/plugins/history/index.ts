import { ToolbarItem, MenubarItem } from '@/main';
import { Plugin } from '@/interfaces';
import { Undo, Redo } from '@icon-park/svg';
import { stringifySVG } from '@/utils';

import { TopMenuKey } from '../topMenu';

export const enum HistoryKey {
  HISTORY_UNDO = 'history-undo',
  HISTORY_REDO = 'history-redo',
}

const undo = Symbol('undo');
const redo = Symbol('redo');

const historyActions = [
  { key: HistoryKey.HISTORY_UNDO, text: '撤销', command: undo, icon: stringifySVG(Undo) },
  { key: HistoryKey.HISTORY_REDO, text: '恢复', command: redo, icon: stringifySVG(Redo) },
];

export const historyPlugin: Plugin = editor => {
  const { menubar, toolbar, commands } = editor;

  historyActions.forEach(action => {
    const toolbarItem = new ToolbarItem({ icon: action.icon, command: action.command, tooltip: action.text });
    toolbar.load(action.key, toolbarItem);
    const menubarItem = new MenubarItem({ text: action.text, command: action.command });
    menubar.load(action.key, menubarItem, TopMenuKey.EDIT);
  });

  commands.register<ToolbarItem>(undo, () => {
    editor.graph?.undo();
  });

  commands.register<ToolbarItem>(redo, () => {
    editor.graph?.redo();
  });
};
