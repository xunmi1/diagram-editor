import { Observer, Subject, warn, error } from '@/utils';
import { ContextMenuItem } from './ContextMenuItem';

const EVENT_TYPE_LOAD = Symbol('CONTEXT_MENU_ITEM_LOAD');

export class ContextMenu extends Subject {
  protected readonly list: Map<string, ContextMenuItem>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, item: ContextMenuItem, parentKey?: string) {
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
    if (this.get(key) && !menu.children?.has(key)) {
      error(`Context menu (key: ${key}) must use unique keys.`);
      return;
    }
    menu.appendChild(key, item);
    this.emit(EVENT_TYPE_LOAD, { parentKey, parent: menu, key, item });
  }

  get(key: string) {
    return this._get(key, this.list);
  }

  onDidLoad(callback: Observer<{ parentKey?: string; parent?: ContextMenuItem; key: string; item: ContextMenuItem }>) {
    return this.on(EVENT_TYPE_LOAD, callback);
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }

  forEach(callback: (value: ContextMenuItem, key: string) => void) {
    return this.list.forEach((v, k) => callback(v, k));
  }

  private _get(key: string, list: Map<string, ContextMenuItem>): ContextMenuItem | undefined {
    for (const [k, v] of list) {
      if (k === key) return v;
      if (v.children?.size) {
        const target = this._get(key, v.children);
        if (target) return target;
      }
    }
  }
}
