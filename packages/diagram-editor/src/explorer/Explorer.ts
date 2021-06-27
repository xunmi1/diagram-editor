import { Subject, Observer, BaseEvents } from '../utils';
import type { ExplorerItem } from './ExplorerItem';

const EVENT_TYPE_LOAD = Symbol('EXPLORER_ITEM_LOAD');

interface Events<T> extends BaseEvents {
  [EVENT_TYPE_LOAD]: { key: string; item: T };
}

export class Explorer extends Subject<Events<ExplorerItem>> {
  protected readonly list: Map<string, ExplorerItem>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, item: ExplorerItem) {
    this.list.set(key, item);
    this.emit(EVENT_TYPE_LOAD, { key, item });
  }

  onDidLoad(callback: Observer<{ key: string; item: ExplorerItem }>) {
    return this.on(EVENT_TYPE_LOAD, callback);
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }

  get(key: string) {
    return this.list.get(key);
  }

  forEach(callback: (value: ExplorerItem, key: string) => void) {
    return this.list.forEach((v, k) => callback(v, k));
  }
}
