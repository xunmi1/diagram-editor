import { Observer, Subject } from '@/utils';
import { ToolbarItem } from './ToolbarItem';

const EVENT_TYPE_LOAD = Symbol('TOOLBAR_ITEM_LOAD');

export class Toolbar extends Subject {
  protected readonly list: Map<string, ToolbarItem>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, item: ToolbarItem) {
    this.list.set(key, item);
    this.emit(EVENT_TYPE_LOAD, { key, item });
    return;
  }

  onDidLoad(callback: Observer<{ key: string; item: ToolbarItem }>) {
    return this.on(EVENT_TYPE_LOAD, callback);
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }

  get(key: string) {
    return this.list.get(key);
  }

  forEach(callback: (value: ToolbarItem, key: string) => void) {
    return this.list.forEach((v, k) => callback(v, k));
  }
}
