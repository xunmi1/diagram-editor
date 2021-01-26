import { ExplorerNodeItem } from '@/explorer';
import { BasicRect } from '@/plugins/shapes';

export default class NodeBasePanel extends ExplorerNodeItem {
  title = '基础节点';
  created() {
    this.load(new BasicRect(), new BasicRect(), new BasicRect(), new BasicRect(), {
      shape: 'image',
      width: 94,
      height: 28,
      imageUrl: 'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
    });
  }
}
