import type { Graph } from '@antv/x6';

export type GraphOptions = ConstructorParameters<typeof Graph>[0];

export interface EditorOptions {
  graph?: GraphOptions;
}