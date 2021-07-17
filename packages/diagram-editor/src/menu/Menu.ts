import { warn, error, lazyTask } from '@diagram-editor/shared';
import { BaseEvents, Observer, Subject } from '../utils';
import { MenuItem } from './MenuItem';
import { getGroups } from './utils';

const EVENT_TYPE_LOAD = Symbol('MENU_ITEM_LOAD');
const EVENT_TYPE_CHANGE_GROUPS = Symbol('CHANGE_GROUPS');

interface Events<T> extends BaseEvents {
  [EVENT_TYPE_LOAD]: { parentKey?: string; parent?: T; key: string; item: T };
  [EVENT_TYPE_CHANGE_GROUPS]: void;
}

export class Menu<T extends MenuItem> extends Subject<Events<T>> {
  #groups: string[];

  protected readonly list: Map<string, T>;

  protected constructor() {
    super();
    this.list = new Map();
    this.#groups = [];

    this._emitGroups = lazyTask(this._emitGroups);
  }

  get groups() {
    return [...this.#groups];
  }

  set groups(groups: string[]) {
    this.#groups = getGroups(groups);
    this._emitGroups();
  }

  load(key: string, item: T, parentKey?: string) {
    if (!parentKey) {
      this.list.set(key, item);
      if (!this.#groups.includes(key)) this.#groups.push(key);
      this._emitGroups();
      this.emit(EVENT_TYPE_LOAD, { key, item });
      return;
    }

    const menu = this.get(parentKey);
    if (!menu) {
      warn(`The parent menu '${parentKey}' does not exist and failed to load submenu '${key}'.`);
      return;
    }
    // 如果当前菜单列表中已存在 key, 同时目标父级菜单下没有该 key,
    // 则说明不是对菜单替换，一旦插入,菜单列表会出现重复的 key
    if (this.get(key) && !menu.children?.has(key)) {
      error(`The Menu '${key}' must use unique keys.`);
      return;
    }
    menu.appendChild(key, item);
    this.emit(EVENT_TYPE_LOAD, { parentKey, parent: menu, key, item });
  }

  get(key: string) {
    return this.#findChild(key, this.list);
  }

  onDidLoad(callback: Observer<{ parentKey?: string; parent?: T; key: string; item: T }>) {
    return this.on(EVENT_TYPE_LOAD, callback);
  }

  onDidChangeGroups(callback: Observer<void>) {
    return this.on(EVENT_TYPE_CHANGE_GROUPS, callback);
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }

  forEach(callback: (value: T, key: string) => void) {
    return this.list.forEach((v, k) => callback(v, k));
  }

  #findChild(key: string, list: Map<string, T>): T | undefined {
    // TODO 使用迭代器
    // eslint-disable-next-line
    for (const [k, v] of list) {
      if (k === key) return v;
      if (v.children?.size) {
        const target = this.#findChild(key, v.children);
        if (target) return target;
      }
    }

    return undefined;
  }

  private _emitGroups() {
    this.emit(EVENT_TYPE_CHANGE_GROUPS);
  }
}
