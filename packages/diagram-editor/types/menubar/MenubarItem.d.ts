import { MenuItem, MenuItemOptions } from '@/menu';
export interface MenubarItemOptions extends MenuItemOptions {}
export declare class MenubarItem extends MenuItem<MenubarItem> {
  constructor(options: MenubarItemOptions);
}
