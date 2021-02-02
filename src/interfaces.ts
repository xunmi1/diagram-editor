import type { Graph } from '@antv/x6';
import type DiagramEditor from '@/main';
import { Disposable, Observer } from '@/utils';

export type { DiagramEditor };

export type GraphOptions = ConstructorParameters<typeof Graph>[0];

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

export interface LifecycleCallback {
  (editor: DiagramEditor): void;
}

/**
 * Lifecycle: 生命周期
 *
 * `created`, `destroy` 只调用一次; `mount` 相关函数会根据实际情况调用多次
 */
export interface Lifecycle {
  created?(editor: DiagramEditor): void;
  destroy?(editor: DiagramEditor): void;

  mount(rootContainer: Element): void | Promise<void>;
  unmount(rootContainer: Element): void | Promise<void>;

  onWillMount(callback: LifecycleCallback): Disposable;
  onDidMount(callback: LifecycleCallback): Disposable;
  onWillUnmount(callback: LifecycleCallback): Disposable;
  onDidUnmount(callback: LifecycleCallback): Disposable;
}

export interface Menu<T extends Menu = Menu<any>> {
  text: string;
  checked: boolean;
  disabled: boolean;
  visible: boolean;
  children?: Map<string, T>;

  onDidAppendChild(callback: Observer<{ key: string; child: T }>): Disposable;
  onDidChangeState(callback: Observer<T>): Disposable;
}
