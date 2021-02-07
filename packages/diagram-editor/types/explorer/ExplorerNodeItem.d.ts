import { ExplorerItem, DragEvent } from './ExplorerItem';
import { Disposable } from '../utils';
import { Graph, Node } from '@antv/x6';
import { grid } from '@antv/x6/es/layout/grid';
export declare type LayoutOptions = Parameters<typeof grid>[1];
export declare class ExplorerNodeItem extends ExplorerItem {
  readonly title: string;
  graph: Graph | undefined;
  constructor(options?: { title: string });
  mount(container: HTMLElement): void;
  unmount(): void;
  load(...nodeList: (Node.Metadata | Node)[]): void;
  applyLayout(options?: LayoutOptions): void;
  fitToContent(): void;
  onWillDrag(callback: DragEvent): Disposable;
}
