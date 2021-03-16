import { MenuItem, MenuItemOptions } from '../menu';

export interface MenubarItemOptions extends MenuItemOptions {}

export class MenubarItem extends MenuItem {
  constructor(options: MenubarItemOptions) {
    super(options);
  }
}
