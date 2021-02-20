import { ExplorerItem, DragEvent } from './ExplorerItem';
import { Disposable, Observer } from '../interfaces';
import { Graph, Node } from '@antv/x6';
import { LayoutOptions } from './grid';

export type { LayoutOptions };

export declare class ExplorerNodeItem extends ExplorerItem {
  readonly title: string;
  graph: Graph | undefined;
  constructor(options?: Partial<{ title: string; layout: { cellWidth?: number } }>);
  mount(container: HTMLElement): void;
  unmount(): void;
  load(...nodeList: (Node.Metadata | Node)[]): void;
  applyLayout(options?: LayoutOptions): void;
  fitToContent(): void;
  onWillDrag(callback: DragEvent): Disposable;
  onDidResize(callback: Observer<DOMRectReadOnly>): Disposable;
}
