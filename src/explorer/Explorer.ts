import { Subject } from '@/utils';
import type { ExplorerItem } from './ExplorerItem';
import { EventType } from '@/constants';

export class Explorer extends Subject {
  protected readonly list: Map<string, typeof ExplorerItem>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, View: typeof ExplorerItem) {
    this.list.set(key, View);
    this.emit(EventType.EXPLORER_ADDED, { key, View });
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }
}
