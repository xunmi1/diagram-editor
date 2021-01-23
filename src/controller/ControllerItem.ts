import { Subject } from '@/utils';
import type { Cell } from '@antv/x6';
import { Lifecycle, DiagramEditor } from '@/interfaces';

export abstract class ControllerItem extends Subject implements Lifecycle {
  static readonly title: string;
  protected readonly editor: DiagramEditor;

  protected constructor(editor: DiagramEditor) {
    super();
    this.editor = editor;
  }

  abstract mount(rootContainer: Element): void;

  abstract unmount(rootContainer: Element): void;

  abstract activate(cell?: Cell): boolean;
}
