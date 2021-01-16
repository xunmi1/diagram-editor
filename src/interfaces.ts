import type { Graph } from '@antv/x6';
import type DiagramEditor from '@/main';

export type GraphOptions = ConstructorParameters<typeof Graph>[0];

export interface EditorOptions {
  graph?: GraphOptions;
}

export interface Plugin {
  (editor: DiagramEditor): void;
}
