import { MenubarItem } from '@/main';
import { Plugin } from '@/interfaces';

import { TopMenuKey } from '../topMenu';

export const enum ActionKey {
  CUT = 'action-cut',
  COPY = 'action-copy',
  PASTE = 'action-paste',
}

export const ActionCommandId = {
  CUT: Symbol('undo'),
  COPY: Symbol('copy'),
  PASTE: Symbol('paste'),
};

export const actionsPlugin: Plugin = editor => {
  const cutAction = () => {
    const graph = editor.graph;
    if (!graph) return;
    const cells = graph.getSelectedCells();
    if (cells.length) graph.cut(cells, { deep: true });
  };
  const copyAction = () => {
    editor.menubar.load('11111', new MenubarItem({ text: '111' }), 'file');

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

  const actionsMeta = [
    {
      key: ActionKey.CUT,
      text: '剪切',
      command: ActionCommandId.CUT,
      hotKey: 'Ctrl+X',
      action: cutAction,
    },
    {
      key: ActionKey.COPY,
      text: '复制',
      command: ActionCommandId.COPY,
      hotKey: 'Ctrl+C',
      action: copyAction,
    },
    {
      key: ActionKey.PASTE,
      text: '粘贴',
      command: ActionCommandId.PASTE,
      hotKey: 'Ctrl+V',
      action: pasteAction,
    },
  ];

  const { menubar, commands } = editor;
  const parentKey = TopMenuKey.EDIT;

  actionsMeta.forEach(meta => {
    const menubarItem = new MenubarItem({ text: meta.text, command: meta.command, extra: meta.hotKey });
    menubar.load(meta.key, menubarItem, parentKey);
    commands.register(meta.command, meta.action);
  });

  editor.onDidMount(graph => {
    actionsMeta.forEach(meta => {
      graph.bindKey(meta.hotKey, meta.action);
    });
  });

  setTimeout(() => {
    const a = menubar.get(parentKey);
    a!.groups = [ActionKey.COPY, '|', ActionKey.CUT, '|', ActionKey.PASTE, '|', '|'];
  }, 1000);

  setTimeout(() => {
    const a = menubar.get(ActionKey.PASTE);
    a!.checked = true;
  }, 3000);

  setTimeout(() => {
    menubar.load('meta', new MenubarItem({ text: 'xxx' }));

    setTimeout(() => {
      menubar.groups = ['|', 'file', 'edit', '|', '|'];
      menubar.get('meta')!.text = 'xxxx';
      setTimeout(() => {
        menubar.get('meta')!.visible = false;
      }, 1000);
    }, 2000);
  }, 2000);

  // setTimeout(() => {
  //   console.log('change4');
  //   menubar.get(ActionKey.CUT)!.groups = ['1', '|', '2'];
  // }, 8000);
  //
  // setTimeout(() => {
  //   const menubarItem = new MenubarItem({ text: 'xxxx' });
  //   menubar.load('1', menubarItem, ActionKey.CUT);
  //   setTimeout(() => {
  //     const menubarItem = new MenubarItem({ text: 'xxxx1' });
  //     menubar.load('2', menubarItem, ActionKey.CUT);
  //     setTimeout(() => {
  //       const a = menubar.get('1');
  //       console.log('change1');
  //       a!.visible = false;
  //
  //       setTimeout(() => {
  //         console.log('change2');
  //         menubar.get('2')!.visible = false;
  //         setTimeout(() => {
  //           console.log('change3');
  //           menubar.get('2')!.visible = true;
  //           menubar.get('1')!.visible = true;
  //           setTimeout(() => {
  //             menubar.load('1111', new MenubarItem({ text: '3333' }), 'file');
  //           }, 1000);
  //         }, 1000);
  //       }, 1000);
  //
  //       // a!.checked = true;
  //     }, 2000);
  //   }, 100);
  // }, 3000);
};
