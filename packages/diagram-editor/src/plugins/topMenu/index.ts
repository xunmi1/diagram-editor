import { MenubarItem } from '@/menubar';
import { Plugin } from '@/interfaces';

export const enum TopMenuKey {
  FILE = 'file',
  EDIT = 'edit',
  VIEW = 'view',
  TOOL = 'tool',
  HELP = 'help',
}

const topMenuActions = [
  { key: TopMenuKey.FILE, text: '文件' },
  { key: TopMenuKey.EDIT, text: '编辑' },
  { key: TopMenuKey.VIEW, text: '查看' },
  { key: TopMenuKey.TOOL, text: '工具' },
  { key: TopMenuKey.HELP, text: '帮助' },
];

export const topMenuPlugin: Plugin = editor => {
  const menubar = editor.menubar;
  topMenuActions.forEach(action => {
    menubar.load(action.key, new MenubarItem({ text: action.text }));
  });
};
