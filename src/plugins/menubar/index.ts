import { MenubarItem } from '@/menubar';
import { DiagramEditor } from '@/interfaces';

export const installMenubar = (editor: DiagramEditor) => {
  editor.menubar.load('xxxx', new MenubarItem({ text: '测试', command: 'xxxx' }));
  editor.menubar.load('xxxx1', new MenubarItem({ text: '测试1', command: 'xxxx' }));

  editor.menubar.load('6666', new MenubarItem({ text: '6666' }), 'xxxx1');
  const m = new MenubarItem({ text: '2222', command: 'xxxx' });
  setTimeout(() => {
    m.checked = true;
  }, 3000);
  editor.menubar.load('2222', m, 'xxxx1');
  editor.commands.register('xxxx', (menu: MenubarItem) => {
    menu.checked = !menu.checked;
    menu.disabled = !menu.disabled;

    editor.menubar.load('44444', new MenubarItem({ text: '444444' }), 'xxxx');
  });
  editor.menubar.load('3333', new MenubarItem({ text: '3333' }), 'xxxx1');
};
