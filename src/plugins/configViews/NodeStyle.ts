import { ConfigBarView } from '@/config';
import { Cell, Node } from '@antv/x6';

export default class NodeStyle extends ConfigBarView {
  static title = '节点样式';

  mount(container: HTMLElement) {
    const app = window.document.createElement('div');
    app.innerText = '1111';
    container.appendChild(app);
  }

  unmount() {}

  activate(cell?: Cell): boolean {
    return cell instanceof Node && cell.shape === 'rect';
  }
}
