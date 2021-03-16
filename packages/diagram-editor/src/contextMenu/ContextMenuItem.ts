import { DiagramEditor } from '../interfaces';
import { MenuItem, MenuItemOptions } from '../menu';

export interface ContextMenuItemOptions extends MenuItemOptions {}

export class ContextMenuItem extends MenuItem {
  protected constructor(options: ContextMenuItemOptions) {
    super(options);
  }

  activate?(editor: DiagramEditor): boolean;
}
