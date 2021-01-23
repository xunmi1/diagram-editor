import { Subject } from '@/utils';
import { EventType } from '@/constants';
import type { Cell } from '@antv/x6';
import { Lifecycle, DiagramEditor } from '@/interfaces';

export abstract class ExplorerItem extends Subject implements Lifecycle {
  static readonly title: string;
  protected readonly editor: DiagramEditor;

  protected constructor(editor: DiagramEditor) {
    super();
    this.editor = editor;
  }

  start(args: { cell: Cell; event: MouseEvent }) {
    this.emit(EventType.EXPLORER_CELL_MOVE, args);
  }

  abstract mount(rootContainer: Element): void;

  abstract unmount(rootContainer: Element): void;
}
