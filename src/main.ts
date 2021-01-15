import { createApp, shallowReactive, computed, unref, ComputedRef } from 'vue';
import App from './App.vue';
import antd from './antd';
import { Graph } from '@antv/x6';
import { useOnceWatch } from '@/use';
import { EditorOptions } from '@/interfaces';

class DiagramEditor {
  private _graph: ComputedRef<Graph>;
  private options: EditorOptions;

  constructor(options: EditorOptions = {}) {
    this.options = options;
  }

  get graph() {
    return unref(this._graph);
  }

  mount(rootContainer: string | Element) {
    const editor = shallowReactive(this);
    const app = createApp(App, { options: this.options.graph, editor });
    const vm = app.use(antd).mount(rootContainer) as any;
    this._graph = computed(() => vm.graph);

    return new Promise<Graph>(resolve => {
      useOnceWatch(() => {
        if (vm.graph) resolve(this.graph);
        return !!vm.graph;
      });
    });
  }
}

export default DiagramEditor;
