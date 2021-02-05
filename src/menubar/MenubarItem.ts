import { MenuItem, MenuItemOptions } from '@/menu';

export type MenubarItemOptions = MenuItemOptions;

export class MenubarItem extends MenuItem<MenubarItem> {
  constructor(options: MenubarItemOptions) {
    super(options);
  }
}
