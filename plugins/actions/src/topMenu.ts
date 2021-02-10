import { MenubarItem, Plugin } from '@diagram-editor/diagram-editor';
import { TopMenuKey } from './constants';

const menuList = [
  { key: TopMenuKey.FILE, text: '文件' },
  { key: TopMenuKey.EDIT, text: '编辑' },
  { key: TopMenuKey.VIEW, text: '视图' },
  { key: TopMenuKey.TOOL, text: '工具' },
  { key: TopMenuKey.HELP, text: '帮助' },
];

export const topMenuPlugin: Plugin = editor => {
  const menubar = editor.menubar;
  menuList.forEach(item => {
    menubar.load(item.key, new MenubarItem({ text: item.text }));
  });
};
