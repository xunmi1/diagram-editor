import { Subject } from '@/utils';
import type { CellBarView } from './CellBarView';
import { EventType } from '@/constants';

interface BarViewMeta {
  isMounted: boolean;
}

export class CellBarModel extends Subject {
  protected readonly list: Map<string, CellBarView>;
  protected readonly viewMeta: Map<string, BarViewMeta>;

  constructor() {
    super();
    this.list = new Map();
    this.viewMeta = new Map();
  }

  load(key: string, view: CellBarView) {
    this.list.set(key, view);
    this.viewMeta.set(key, { isMounted: false });
    this.emit(EventType.CELL_BAR_VIEW_ADDED, { key, view });
  }

  getMeta(key: string) {
    return this.viewMeta.get(key) ?? { isMounted: false };
  }

  updateMeta(key: string, meta: Partial<BarViewMeta>) {
    const old = this.getMeta(key);
    this.viewMeta.set(key, { ...old, ...meta });
  }

  [Symbol.iterator]() {
    return this.list.entries();
  }
}
