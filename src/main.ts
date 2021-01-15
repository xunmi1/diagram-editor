import { createApp } from 'vue';
import App from './App.vue';
import antd from './antd';
import { Graph } from '@antv/x6';
import { useOnceWatch } from '@/use';
import { EditorOptions } from '@/interfaces';
import { CellModel, CellBarView } from '@/cell';
import NodeBase from '@/cell/views/NodeBase';
import { Subject } from '@/utils';
import { ShapeType } from '@/constants';

class DiagramEditor extends Subject {
  protected readonly cellModel: CellModel;
  private readonly options: EditorOptions;
  public graph: Graph;

  constructor(options: EditorOptions = {}) {
    super({ global: true });
    this.options = options;
    this.cellModel = new CellModel();
  }

  mount(rootContainer: string | Element) {
    const app = createApp(App, { options: this.options.graph, editor: this });
    const vm = app.use(antd).mount(rootContainer) as any;

    return new Promise<Graph>(resolve => {
      useOnceWatch(() => {
        if (vm.graph) {
          this.graph = vm.graph;
          resolve(this.graph);
        }
        this.registerCellBar(ShapeType.NODE_BASE, new NodeBase());

        return !!vm.graph;
      });
    });
  }
  // 添加节点菜单项
  registerCellBar(key: string, view: CellBarView) {
    this.cellModel.register(key, view);
  }
}

export default DiagramEditor;
