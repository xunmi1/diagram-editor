import { Subject, Disposable, Observer } from '../utils';
import type { Cell } from '@antv/x6';
import { DiagramEditor, Lifecycle, LifecycleCallback } from '../interfaces';
export declare type DragEvent = Observer<{
  cell: Cell;
  event: MouseEvent;
}>;
export declare abstract class ExplorerItem extends Subject implements Lifecycle {
  abstract readonly title: string;
  created?(editor: DiagramEditor): void;
  destroy?(editor: DiagramEditor): void;
  onWillDrag?(callback: DragEvent): Disposable;
  onWillMount(callback: LifecycleCallback): Disposable;
  onDidMount(callback: LifecycleCallback): Disposable;
  onWillUnmount(callback: LifecycleCallback): Disposable;
  onDidUnmount(callback: LifecycleCallback): Disposable;
  abstract mount(rootContainer: HTMLElement, editor: DiagramEditor): void;
  abstract unmount(rootContainer: HTMLElement, editor: DiagramEditor): void;
}
