import { Subject } from '@/utils';
import type { ConfigPanel } from './ConfigPanel';
import { EventType } from '@/constants';

export class Controller extends Subject {
  protected readonly list: Map<string, typeof ConfigPanel>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, View: typeof ConfigPanel) {
    this.list.set(key, View);
    this.emit(EventType.CONTROLLER_ADDED, { key, View });
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }
}
