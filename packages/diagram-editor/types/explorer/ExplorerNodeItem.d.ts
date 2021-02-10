import { ExplorerItem, DragEvent } from './ExplorerItem';
import { Disposable, Observer } from '../interfaces';
import { Graph, Node } from '@antv/x6';

export declare interface LayoutOptions {
  columns: number;
  columnWidth?: number | 'auto' | 'compact';
  rowHeight?: number | 'auto' | 'compact';
  dx?: number;
  dy?: number;
  center?: boolean;
}

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
