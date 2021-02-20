import type { Plugin, DiagramEditor } from '@diagram-editor/diagram-editor';
import { topMenuPlugin } from './topMenu';
import { editMenuPlugin } from './edit';
import { historyPlugin } from './history';
import { TopMenuKey, ActionKey } from './constants';

export * from './constants';

export const actionsPlugin = (): Plugin => editor => {
  topMenuPlugin(editor);
  editMenuPlugin(editor);
  historyPlugin(editor);

  sortMenubar(editor.menubar);
};

const groups = ['|', ActionKey.UNDO, ActionKey.REDO, '|', ActionKey.CUT, ActionKey.COPY, ActionKey.PASTE, '|'];

const sortMenubar = (menubar: DiagramEditor['menubar']) => {
  const editMenuItem = menubar.get(TopMenuKey.EDIT);
  editMenuItem!.groups = [...menubar.groups, ...groups];
};
