import { Subject } from '@/utils';
import { EventType } from '@/constants';
import { DiagramEditor, Lifecycle, LifecycleCallback } from '@/interfaces';

export abstract class ControllerItem extends Subject implements Lifecycle {
  readonly title: string;

  created?(editor: DiagramEditor): void;
  destroy?(editor: DiagramEditor): void;

  onWillMount(callback: LifecycleCallback) {
    return this.on(EventType.CONTROLLER_WILL_MOUNT, callback);
  }

  onDidMount(callback: LifecycleCallback) {
    return this.on(EventType.CONTROLLER_DID_MOUNT, callback);
  }

  onWillUnmount(callback: LifecycleCallback) {
    return this.on(EventType.CONTROLLER_WILL_UNMOUNT, callback);
  }

  onDidUnmount(callback: LifecycleCallback) {
    return this.on(EventType.CONTROLLER_DID_UNMOUNT, callback);
  }

  abstract mount(rootContainer: Element): void;

  abstract unmount(rootContainer: Element): void;

  abstract activate(editor: DiagramEditor): boolean;
}
