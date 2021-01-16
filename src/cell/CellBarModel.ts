import { Subject } from '@/utils';
import type { CellBarView } from './CellBarView';
import { EventType } from '@/constants';

export class CellBarModel extends Subject {
  protected readonly list: Map<string, CellBarView>;

  constructor() {
    super({ global: true });
    this.list = new Map();
  }

  register(key: string, view: CellBarView) {
    this.list.set(key, view);

    this.emit(EventType.CELL_BAR_VIEW_ADDED, { key, view });
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }
}
