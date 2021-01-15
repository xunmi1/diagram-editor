import { Subject } from '@/utils';
import { EventType } from '@/constants';
import type { Cell } from '@antv/x6';

export abstract class CellBarView extends Subject {
  abstract readonly title: string;
  protected constructor() {
    super({ global: true });
  }
  abstract mount(rootContainer: string | Element): void;

  start(args: { cell: Cell; e: MouseEvent }) {
    this.emit(EventType.CELL_BAR_VIEW_MOVE, args);
  }
}
