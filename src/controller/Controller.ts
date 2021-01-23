import { Subject } from '@/utils';
import type { ControllerItem } from './ControllerItem';
import { EventType } from '@/constants';

export class Controller extends Subject {
  protected readonly list: Map<string, typeof ControllerItem>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, View: typeof ControllerItem) {
    this.list.set(key, View);
    this.emit(EventType.CONTROLLER_ADDED, { key, View });
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }
}
