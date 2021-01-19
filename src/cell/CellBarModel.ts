import { Subject } from '@/utils';
import type { CellBarView } from './CellBarView';
import { EventType } from '@/constants';

export class CellBarModel extends Subject {
  protected readonly list: Map<string, typeof CellBarView>;

  constructor() {
    super();
    this.list = new Map();
  }

  load(key: string, View: typeof CellBarView) {
    this.list.set(key, View);
    this.emit(EventType.CELL_BAR_VIEW_ADDED, { key, View });
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }
}
