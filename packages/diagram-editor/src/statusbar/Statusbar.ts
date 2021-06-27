import { BaseEvents, Observer, Subject } from '../utils';
import { StatusbarItem } from './StatusbarItem';

const EVENT_TYPE_LOAD = Symbol('STATUSBAR_ITEM_LOAD');

interface Events<T> extends BaseEvents {
  [EVENT_TYPE_LOAD]: { key: string; item: T };
}

export class Statusbar extends Subject<Events<StatusbarItem>> {
  protected readonly list: Map<string, StatusbarItem>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, item: StatusbarItem) {
    this.list.set(key, item);
    this.emit(EVENT_TYPE_LOAD, { key, item });
    return;
  }

  onDidLoad(callback: Observer<{ key: string; item: StatusbarItem }>) {
    return this.on(EVENT_TYPE_LOAD, callback);
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }

  get(key: string) {
    return this.list.get(key);
  }

  forEach(callback: (value: StatusbarItem, key: string) => void) {
    return this.list.forEach((v, k) => callback(v, k));
  }
}
