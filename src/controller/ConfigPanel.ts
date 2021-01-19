import { Subject } from '@/utils';
import type DiagramEditor from '@/main';
import type { Cell } from '@antv/x6';

export abstract class ConfigPanel extends Subject {
  static readonly title: string;
  protected readonly editor: DiagramEditor;

  protected constructor(editor: DiagramEditor) {
    super();
    this.editor = editor;
  }

  abstract mount(rootContainer: string | Element): void;

  abstract unmount(): void;

  abstract activate(cell?: Cell): boolean;
}
