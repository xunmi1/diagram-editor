import { ExplorerItem } from './ExplorerItem';
import { Cell, Graph, Node } from '@antv/x6';
import { grid } from '@antv/x6/es/layout/grid';

type LayoutOptions = Parameters<typeof grid>[1];

// 默认间距
const DEFAULT_SPACING = 16;
// 默认每行节点数量
const DEFAULT_COLUMNS = 3;

const defaultLayoutOptions: LayoutOptions = {
  columns: DEFAULT_COLUMNS,
  dx: DEFAULT_SPACING,
  dy: DEFAULT_SPACING,
  center: false,
  resizeToFit: true,
};

const NODE_EVENT_MOUSEDOWN = 'cell:mousedown';
const EVENT_TYPE_WILL_DRAG = Symbol('WILL_DRAG');

export class ExplorerNodeItem extends ExplorerItem {
  public readonly title: string;
  public graph: Graph | undefined;

  mount(container: HTMLElement): void {
    this.graph = new Graph({
      container,
      interacting: false,
      preventDefaultBlankAction: false,
    });
    this.bindMoveEvent();
    this.fitToContent();
  }

  unmount() {
    this.unbindMoveEvent();
    this.graph?.dispose();
  }

  load(...nodeList: (Node.Metadata | Node)[]) {
    const graph = this.graph;
    if (!graph) return;
    nodeList.forEach(node => graph.addNode(<Node>node));
    this.applyLayout();
  }

  applyLayout(options?: LayoutOptions) {
    const model: any = this.graph?.model;
    grid(model, { ...defaultLayoutOptions, ...options });
    this.fitToContent();
  }

  fitToContent() {
    this.graph?.fitToContent({ gridHeight: 1, gridWidth: 1, padding: DEFAULT_SPACING });
  }

  onWillDrag(callback: (args: { cell: Cell; event: MouseEvent }) => void) {
    return this.on(EVENT_TYPE_WILL_DRAG, callback);
  }

  protected bindMoveEvent() {
    this.graph?.on(NODE_EVENT_MOUSEDOWN, args => {
      this.emit(EVENT_TYPE_WILL_DRAG, { cell: args.cell, event: args.e });
    });
  }

  protected unbindMoveEvent() {
    this.graph?.off(NODE_EVENT_MOUSEDOWN);
  }
}
