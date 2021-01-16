import { NodeBarView } from '@/cell';
import { BasicRect } from '@/plugins/shapes';

export default class NodeBase extends NodeBarView {
  public constructor() {
    super();
    this.title = '基础节点';
  }

  mounted() {
    this.load(new BasicRect());
  }
}
