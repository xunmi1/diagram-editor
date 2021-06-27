import { BaseEvents, Observer, Subject } from '../utils';
import type { ControllerItem } from './ControllerItem';

const EVENT_TYPE_LOAD = Symbol('CONTROLLER_ITEM_LOAD');

interface Events extends BaseEvents {
  [EVENT_TYPE_LOAD]: { key: string; item: ControllerItem };
}

export class Controller extends Subject<Events> {
  protected readonly list: Map<string, ControllerItem>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, item: ControllerItem) {
    this.list.set(key, item);
    this.emit(EVENT_TYPE_LOAD, { key, item });
  }

  onDidLoad(callback: Observer<{ key: string; item: ControllerItem }>) {
    return this.on(EVENT_TYPE_LOAD, callback);
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }

  get(key: string) {
    return this.list.get(key);
  }

  forEach(callback: (value: ControllerItem, key: string) => void) {
    return this.list.forEach((v, k) => callback(v, k));
  }
}
