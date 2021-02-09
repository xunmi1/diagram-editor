import { MenubarItem, Plugin } from '@diagram-editor/diagram-editor';

import { TopMenuKey, CommandId, ActionKey } from './constants';

const parentKey = TopMenuKey.EDIT;

export const editMenuPlugin: Plugin = editor => {
  const cutAction = () => {
    const graph = editor.graph;
    if (!graph) return;
    const cells = graph.getSelectedCells();
    if (cells.length) graph.cut(cells, { deep: true });
  };
  const copyAction = () => {
    const graph = editor.graph;
    if (!graph) return;
    const cells = graph.getSelectedCells();
    if (cells.length) graph.copy(cells, { deep: true });
  };
  const pasteAction = () => {
    const graph = editor.graph;
    if (!graph || graph.isClipboardEmpty()) return;
    const cells = graph.paste();
    graph.cleanSelection();
    graph.select(cells);
  };

  const menuList = [
    {
      key: ActionKey.CUT,
      text: '剪切',
      command: CommandId.CUT,
      hotKey: 'Ctrl+X',
      action: cutAction,
    },
    {
      key: ActionKey.COPY,
      text: '复制',
      command: CommandId.COPY,
      hotKey: 'Ctrl+C',
      action: copyAction,
    },
    {
      key: ActionKey.PASTE,
      text: '粘贴',
      command: CommandId.PASTE,
      hotKey: 'Ctrl+V',
      action: pasteAction,
    },
  ];

  const { menubar, commands } = editor;

  menuList.forEach(item => {
    const menubarItem = new MenubarItem({ text: item.text, command: item.command, extra: item.hotKey });
    menubar.load(item.key, menubarItem, parentKey);
    commands.register(item.command, item.action);
  });

  editor.onDidMount(graph => {
    menuList.forEach(item => {
      graph.bindKey(item.hotKey, item.action);
    });
  });
};
