import { DiagramEditor } from '../interfaces';
import { MenuItem, MenuItemOptions } from '../menu';
export interface ContextMenuItemOptions extends MenuItemOptions {}
export declare class ContextMenuItem extends MenuItem<ContextMenuItem> {
  constructor(options: ContextMenuItemOptions);
  activate?(editor: DiagramEditor): boolean;
}
