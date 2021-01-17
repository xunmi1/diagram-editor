import { createApp } from 'vue';
import type { Graph } from '@antv/x6';
import App from '@/App.vue';
import antd from '@/antd';
import { useOnceWatch } from '@/use';
import { EditorOptions, Plugin } from '@/interfaces';
import { CellBarModel, CellBarView, NodeBarView } from '@/cell';
import { Subject, warn } from '@/utils';

export { CellBarView, NodeBarView };
export * from '@/plugins';

class DiagramEditor extends Subject {
  public readonly cellBarModel: CellBarModel;
  public graph: Graph;
  private readonly options: EditorOptions;
  private readonly installedPlugins: Set<Plugin>;

  constructor(options: EditorOptions = {}) {
    super({ global: true });
    this.options = options;
    this.cellBarModel = new CellBarModel();
    this.installedPlugins = new Set();
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

        return !!vm.graph;
      });
    });
  }
  // 添加节点菜单项
  loadCellBar(key: string, view: CellBarView) {
    this.cellBarModel.load(key, view);
  }

  use(plugin: Plugin) {
    if (this.installedPlugins.has(plugin)) {
      warn(`Plugin '${plugin.name}' has already been applied to target editor.`);
    } else {
      plugin(this);
      this.installedPlugins.add(plugin);
    }
    return this;
  }
}

export default DiagramEditor;
