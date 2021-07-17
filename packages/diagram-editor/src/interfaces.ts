import type { Graph } from '@antv/x6';
import type DiagramEditor from './editor';
import type { Disposable, Observer } from './utils';

export type { Observer, Disposable, Command, CommandId, CommandsRegistry } from './utils';

export type { DiagramEditor };

export type GraphOptions = Omit<ConstructorParameters<typeof Graph>[0], 'container'>;

export interface EditorOptions {
  graph?: GraphOptions;

  explorer?: boolean;
  controller?: boolean;
  menubar?: boolean;
  toolbar?: boolean;
  statusbar?: boolean;
  contextMenu?: boolean;
}

export interface Plugin {
  (editor: DiagramEditor): void;
}

export interface LifecycleCallback extends Observer<DiagramEditor> {}

/**
 * Lifecycle: 生命周期
 *
 * `created`, `destroy` 只调用一次; `mount` 相关函数会根据实际情况调用多次
 */
export interface Lifecycle {
  created?(editor: DiagramEditor): void;
  destroy?(editor: DiagramEditor): void;

  mount(rootContainer: HTMLElement, editor: DiagramEditor): void | Promise<void>;
  unmount(): void | Promise<void>;

  onWillMount(callback: LifecycleCallback): Disposable;
  onDidMount(callback: LifecycleCallback): Disposable;
  onWillUnmount(callback: LifecycleCallback): Disposable;
  onDidUnmount(callback: LifecycleCallback): Disposable;
}
