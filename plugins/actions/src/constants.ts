export const enum TopMenuKey {
  FILE = 'file',
  EDIT = 'edit',
  VIEW = 'view',
  TOOL = 'tool',
  HELP = 'help',
}

export const enum ActionKey {
  CUT = 'action-cut',
  COPY = 'action-copy',
  PASTE = 'action-paste',
  UNDO = 'action-undo',
  REDO = 'action-redo',
}

export const CommandId = {
  CUT: Symbol('undo'),
  COPY: Symbol('copy'),
  PASTE: Symbol('paste'),
};
