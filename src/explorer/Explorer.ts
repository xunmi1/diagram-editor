import { Subject } from '@/utils';
import type { CellPanel } from './CellPanel';
import { EventType } from '@/constants';

export class Explorer extends Subject {
  protected readonly list: Map<string, typeof CellPanel>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, View: typeof CellPanel) {
    this.list.set(key, View);
    this.emit(EventType.EXPLORER_ADDED, { key, View });
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }
}
