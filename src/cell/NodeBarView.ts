import { CellBarView } from '@/cell/CellBarView';
import { Graph, Node } from '@antv/x6';

const DEFAULT_PADDING = 12;
const NODE_EVENT_MOUSEDOWN = 'node:mousedown';

export class NodeBarView extends CellBarView {
  public title: string;
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

  mounted() {}

  unmount() {
    this.unbindMoveEvent();
  }

  load(...nodeList: Node[]): void;
  load(...nodeList: Node.Metadata[]): void;
  load(...nodeList: any[]) {
    const graph = this.graph;
    if (!graph) return;
    nodeList.forEach(node => graph.addNode(node));
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
