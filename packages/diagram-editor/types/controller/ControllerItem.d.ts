import { Subject, Disposable } from '../utils';
import { DiagramEditor, Lifecycle, LifecycleCallback } from '../interfaces';
export declare abstract class ControllerItem extends Subject implements Lifecycle {
  readonly title: string;
  created?(editor: DiagramEditor): void;
  destroy?(editor: DiagramEditor): void;
  onWillMount(callback: LifecycleCallback): Disposable;
  onDidMount(callback: LifecycleCallback): Disposable;
  onWillUnmount(callback: LifecycleCallback): Disposable;
  onDidUnmount(callback: LifecycleCallback): Disposable;
  abstract mount(rootContainer: HTMLElement, editor: DiagramEditor): void;
  abstract unmount(rootContainer: HTMLElement, editor: DiagramEditor): void;
  abstract activate(editor: DiagramEditor): boolean;
}
