import { Observer, Subject, warn } from '@/utils';
import { MenubarItem } from './MenubarItem';

const EVENT_TYPE_LOAD = Symbol('MENUBAR_ITEM_LOAD');

export class Menubar extends Subject {
  protected readonly list: Map<string, MenubarItem>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, item: MenubarItem, parentKey?: string) {
    if (!parentKey) {
      this.list.set(key, item);
      this.emit(EVENT_TYPE_LOAD, { key, item });
      return;
    }

    const menu = this.get(parentKey);
    if (menu) {
      menu.appendChild(key, item);
      this.emit(EVENT_TYPE_LOAD, { parentKey, parent: menu, key, item });
    } else {
      warn('The parent menu does not exist and failed to load submenu.');
    }
  }

  get(key: string, list = this.list): MenubarItem | undefined {
    for (const [k, v] of list) {
      if (k === key) return v;
      if (v.children?.size) {
        const target = this.get(key, v.children);
        if (target) return target;
      }
    }
  }

  onDidLoad(callback: Observer<{ parentKey?: string; parent?: MenubarItem; key: string; item: MenubarItem }>) {
    return this.on(EVENT_TYPE_LOAD, callback);
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }

  forEach(callback: (value: MenubarItem, key: string) => void) {
    return this.list.forEach((v, k) => callback(v, k));
  }
}
