import { CellBarView } from '@/cell/CellBarView';
import { Graph, Node } from '@antv/x6';

export abstract class NodeBarView extends CellBarView {
  abstract readonly title: string;
  public graph: Graph | undefined;
  abstract mounted(): void;

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

  load(...nodeList: Node[]) {
    nodeList.forEach(node => {
      this.graph?.addNode(node);
    });
    this.fitToContent();
  }

  fitToContent() {
    this.graph?.fitToContent({ gridHeight: 1, padding: 12 });
  }

  bindMoveEvent() {
    this.graph?.on('node:mousedown', args => this.start(args));
  }
}
