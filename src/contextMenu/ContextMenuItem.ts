import { DiagramEditor } from '@/interfaces';
import { MenuItem, MenuItemOptions } from '@/menu';

export type ContextMenuItemOptions = MenuItemOptions;

export class ContextMenuItem extends MenuItem<ContextMenuItem> {
  constructor(options: ContextMenuItemOptions) {
    super(options);
  }

  activate?(editor: DiagramEditor): boolean;
}
