import { CellBarView } from '@/cell/CellBarView';
import { Graph, Node } from '@antv/x6';

const DEFAULT_PADDING = 16;
const NODE_EVENT_MOUSEDOWN = 'cell:mousedown';

interface Lifecycle {
  mounted(): void;
  beforeUnmount(): void;
}

export class NodeBarView extends CellBarView implements Lifecycle {
  public graph: Graph | undefined;

  mount(container: HTMLElement): void {
    this.graph = new Graph({
      container,
      interacting: false,
      preventDefaultBlankAction: false,
    });
    this.bindMoveEvent();
    this.mounted();
    this.fitToContent();
  }

  unmount() {
    this.beforeUnmount();
    this.unbindMoveEvent();
  }

  mounted() {}
  beforeUnmount() {}

  load(...nodeList: (Node.Metadata | Node)[]) {
    const graph = this.graph;
    if (!graph) return;
    nodeList.forEach(node => graph.addNode(<Node>node));
    this.fitToContent();
  }

  fitToContent() {
    this.graph?.fitToContent({ gridHeight: 1, padding: DEFAULT_PADDING });
  }

  bindMoveEvent() {
    this.graph?.on(NODE_EVENT_MOUSEDOWN, args => this.start(args));
  }

  unbindMoveEvent() {
    this.graph?.off(NODE_EVENT_MOUSEDOWN);
  }
}
