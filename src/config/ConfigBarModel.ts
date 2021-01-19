import { Subject } from '@/utils';
import type { ConfigBarView } from './ConfigBarView';
import { EventType } from '@/constants';

export class ConfigBarModel extends Subject {
  protected readonly list: Map<string, typeof ConfigBarView>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, View: typeof ConfigBarView) {
    this.list.set(key, View);
    this.emit(EventType.CONFIG_BAR_VIEW_ADDED, { key, View });
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }
}
