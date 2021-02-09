import { createApp, reactive, App } from 'vue';
import antd from './antd';
import { DiagramEditor, ControllerItem, Plugin } from '@diagram-editor/diagram-editor';
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

const initState = (editor: DiagramEditor, state: State) => {
  editor.onDidMount(async () => {
    const graph = editor.graph!;
    const options = graph.options;
    state.gridVisible = options.grid.visible;
    state.gridSize = graph.getGridSize();
    state.backgroundColor = (options.background ? options.background.color : null) ?? 'transparent';
    state.scrollerEnable = options.scroller.enabled ?? false;
    state.scrollerPannable = graph.isPannable();
  });
};

export default class GraphConfig extends ControllerItem {
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
    initState(editor, this.state);
    const rootProps: RootProps = { editor, state: this.state };
    this.app = createApp(Panel, rootProps).use(antd);
    this.app.mount(container);
  }

  unmount(container: HTMLElement) {
    this.app?.unmount(container);
    this.app = undefined;
  }

  activate(editor: DiagramEditor): boolean {
    return !editor.activeCell;
  }
}

export interface PluginOptions {
  key: string;
  title?: string;
}

export const graphConfigPlugin = (options: PluginOptions): Plugin => editor => {
  const graphConfig = new GraphConfig({ title: options.title ?? '画布属性' });

  registerCommands(editor, graphConfig.state);
  editor.controller.load(options.key, graphConfig);
};
