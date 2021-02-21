import { Subject, Disposable, Observer } from '../utils';
import type { Cell } from '@antv/x6';
import { DiagramEditor, Lifecycle, LifecycleCallback } from '../interfaces';
import { EventType } from '../constants';

export type DragEvent = Observer<{
  cell: Cell;
  event: MouseEvent;
}>;

export abstract class ExplorerItem extends Subject implements Lifecycle {
  abstract readonly title: string;

  created?(editor: DiagramEditor): void;
  destroy?(editor: DiagramEditor): void;

  onWillDrag?(callback: DragEvent): Disposable;

  onWillMount(callback: LifecycleCallback) {
    return this.on(EventType.EXPLORER_WILL_MOUNT, callback);
  }

  onDidMount(callback: LifecycleCallback) {
    return this.on(EventType.EXPLORER_DID_MOUNT, callback);
  }

  onWillUnmount(callback: LifecycleCallback) {
    return this.on(EventType.EXPLORER_WILL_UNMOUNT, callback);
  }

  onDidUnmount(callback: LifecycleCallback) {
    return this.on(EventType.EXPLORER_DID_UNMOUNT, callback);
  }

  abstract mount(rootContainer: HTMLElement, editor: DiagramEditor): void;

  abstract unmount(rootContainer: HTMLElement, editor: DiagramEditor): void;
}
