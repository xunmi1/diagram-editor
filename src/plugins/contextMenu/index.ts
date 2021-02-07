import { Plugin, DiagramEditor } from '@/interfaces';
import { ContextMenuItem } from '@/index';

class C extends ContextMenuItem {
  activate(editor: DiagramEditor): boolean {
    return !!editor.mouseCell;
  }
}

export const contextMenuPlugin: Plugin = editor => {
  const symbol = Symbol();

  editor.contextMenu.load('xxxx', new ContextMenuItem({ text: 'xxxxxx' }));
  editor.contextMenu.load('xxxx1', new ContextMenuItem({ text: 'xxxxxx1', command: symbol }));
  // editor.contextMenu.load('xxxx2', new C({ text: 'xxxxxx2' }));
  editor.contextMenu.load('xxxx3', new C({ text: 'xxxxxx3' }), 'xxxx');
  editor.contextMenu.load('xxxx4', new ContextMenuItem({ text: 'xxxxxx4', command: symbol }), 'xxxx3');
  editor.contextMenu.load('xxxx5', new ContextMenuItem({ text: 'xxxxxx5', command: symbol }), 'xxxx');
  editor.commands.register<ContextMenuItem>(symbol, menu => {
    menu.checked = !menu.checked;
  });
  setTimeout(() => {
    editor.contextMenu.groups = ['xxxx', '|', 'xxxx1', 'xxxx2'];
    editor.contextMenu.load('xxxx2', new C({ text: 'xxxxxx2' }));
  }, 4000);
};
