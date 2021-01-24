import { Subject, Disposable } from '@/utils';
import type { Cell } from '@antv/x6';
import { DiagramEditor, Lifecycle, LifecycleCallback } from '@/interfaces';
import { EventType } from '@/constants';

export abstract class ExplorerItem extends Subject implements Lifecycle {
  abstract readonly title: string;

  constructor() {
    super();
  }

  created?(editor: DiagramEditor): void;
  destroy?(editor: DiagramEditor): void;

  onWillDrag?(callback: (args: { cell: Cell; event: MouseEvent }) => void): Disposable;

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

  abstract mount(rootContainer: Element): void;

  abstract unmount(rootContainer: Element): void;
}
