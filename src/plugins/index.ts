import { Plugin } from '@/interfaces';
import NodeBasePanel from './views/NodeBasePanel';
import GraphConfigPanel from './views/GraphConfigPanel';

import { MenubarItem } from '@/menubar';

export const enum ExplorerKey {
  NODE_BASE = 'NODE_BASE',
  NODE_COMBINATION = 'NODE_COMBINATION',
}

export const enum ControllerKey {
  GRAPH = 'GRAPH',
  NODE = 'NODE',
}

export const builtInPlugin: Plugin = editor => {
  const graphConfigPanel = new GraphConfigPanel();
  editor.explorer.load(ExplorerKey.NODE_BASE, new NodeBasePanel());

  editor.controller.load(ControllerKey.GRAPH, graphConfigPanel);

  editor.menubar.load('xxxx', new MenubarItem({ title: '测试', command: 'xxxx' }));
  editor.menubar.load('xxxx1', new MenubarItem({ title: '测试1', command: 'xxxx' }));

  editor.menubar.load('6666', new MenubarItem({ title: '6666' }), 'xxxx1');
  const m = new MenubarItem({ title: '2222', command: 'xxxx' });
  editor.menubar.load('2222', m, 'xxxx1');
  editor.commands.register('xxxx', (menu: MenubarItem) => {
    menu.state = { ...menu.state, checked: !menu.state.checked, disabled: true };
  });
  editor.menubar.load('3333', new MenubarItem({ title: '3333' }), 'xxxx1');
  editor.menubar.load('44444', new MenubarItem({ title: '444444' }), '3333');
};
