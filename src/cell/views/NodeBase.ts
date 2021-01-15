import { NodeBarView } from '@/cell';
import { BasicRect } from '@/shapes';

export default class NodeBase extends NodeBarView {
  readonly title: string;

  public constructor() {
    super();
    this.title = '基础节点';
  }

  mounted() {
    this.load(new BasicRect());
  }
}
