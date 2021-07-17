import { createApp, reactive, App } from 'vue';
import { DiagramEditor, ControllerItem, Plugin } from '@diagram-editor/diagram-editor';
import antd from './antd';
import Panel from './Panel.vue';
import { registerCommands } from './commands';

export { CommandId } from './commands';
export type { GridOptions, ScrollerOptions, BackgroundOptions } from './commands';

export interface State {
  gridVisible: boolean;
  gridSize: number;

  backgroundColor: string;

  scrollerEnable: boolean;
  scrollerPannable: boolean;
}

export interface RootProps extends Record<string, unknown> {
  state: State;
  editor: DiagramEditor;
}

class GraphConfig extends ControllerItem {
  public readonly title: string;

  public readonly state: State;

  private app?: App;

  constructor(options: { title: string }) {
    super();
    this.title = options.title;
    this.state = reactive<State>({
      gridVisible: true,
      gridSize: 10,
      backgroundColor: 'transparent',
      scrollerEnable: true,
      scrollerPannable: false,
    });
  }

  mount(container: HTMLElement, editor: DiagramEditor) {
    this.#initState(editor);
    const rootProps: RootProps = { editor, state: this.state };
    this.app = createApp(Panel, rootProps).use(antd);
    this.app.mount(container);
  }

  unmount() {
    this.app?.unmount();
    this.app = undefined;
  }

  activate(editor: DiagramEditor): boolean {
    return !editor.activeCell;
  }

  #initState(editor: DiagramEditor) {
    editor.onDidMount(async () => {
      const graph = editor.graph!;
      const options = graph.options;
      this.state.gridVisible = options.grid.visible;
      this.state.gridSize = graph.getGridSize();
      this.state.backgroundColor = (options.background ? options.background.color : null) ?? 'transparent';
      this.state.scrollerEnable = options.scroller.enabled ?? false;
      this.state.scrollerPannable = graph.isPannable();
    });
  }
}

export interface PluginOptions {
  key: string;
  title?: string;
}

export const graphConfigPlugin =
  (options: PluginOptions): Plugin =>
  editor => {
    const graphConfig = new GraphConfig({ title: options.title ?? '画布属性' });

    registerCommands(editor, graphConfig.state);
    editor.controller.load(options.key, graphConfig);
  };
