import { NodeBarView } from '@/cell';
import { BasicRect } from '@/plugins/shapes';

export default class NodeBase extends NodeBarView {
  static title = '基础节点';

  mounted() {
    this.load(new BasicRect(), {
      shape: 'image',
      x: 120,
      y: 240,
      width: 94,
      height: 28,
      imageUrl: 'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
    });
  }
}
