import type { Graph } from '@antv/x6';
import type DiagramEditor from '@/main';

export type { DiagramEditor };

export type GraphOptions = ConstructorParameters<typeof Graph>[0];

export interface EditorOptions {
  graph?: GraphOptions;
}

export interface Plugin {
  (editor: DiagramEditor): void;
}

/**
 * Lifecycle: 生命周期
 *
 * `created`, `destroy` 只调用一次; `mount` 相关函数会根据实际情况调用多次
 */
export interface Lifecycle {
  created?(): void;

  mount(rootContainer: Element): void;
  mounted?(): void;
  beforeUnmount?(): void;
  unmount(rootContainer: Element): void;

  destroy?(): void;
}
