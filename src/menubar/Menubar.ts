import { Observer, Subject, warn, error } from '@/utils';
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
    if (!menu) {
      warn('The parent menu does not exist and failed to load submenu.');
      return;
    }
    // 如果当前菜单列表中已存在 key, 同时目标父级菜单下没有该 key,
    // 则说明不是对菜单替换，一旦插入,菜单列表会出现重复的 key
    if (this.get(key) && !menu.children?.has(key)) {
      error(`Menubar (key: ${key}) must use unique keys.`);
      return;
    }
    menu.appendChild(key, item);
    this.emit(EVENT_TYPE_LOAD, { parentKey, parent: menu, key, item });
  }

  get(key: string) {
    return this._get(key, this.list);
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

  private _get(key: string, list: Map<string, MenubarItem>): MenubarItem | undefined {
    for (const [k, v] of list) {
      if (k === key) return v;
      if (v.children?.size) {
        const target = this._get(key, v.children);
        if (target) return target;
      }
    }
  }
}
