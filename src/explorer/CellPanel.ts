import { Subject } from '@/utils';
import { EventType } from '@/constants';
import type { Cell } from '@antv/x6';
import type DiagramEditor from '@/main';

export abstract class CellPanel extends Subject {
  static readonly title: string;
  protected readonly editor: DiagramEditor;

  protected constructor(editor: DiagramEditor) {
    super();
    this.editor = editor;
  }

  start(args: { cell: Cell; e: MouseEvent }) {
    this.emit(EventType.CELL_BAR_VIEW_MOVE, args);
  }

  abstract mount(rootContainer: string | Element): void;

  abstract unmount(): void;
}
