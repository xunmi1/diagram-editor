import { createApp, reactive, App } from 'vue';
import antd from '@/antd';
import { ControllerItem } from '@/controller';
import Panel from './Panel.vue';
import { DiagramEditor, Plugin } from '@/interfaces';
import { registerCommands } from './commands';

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
  title = '画布属性';

  public readonly state: State;
  private app?: App;

  constructor() {
    super();
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

export const graphConfigPlugin: Plugin = editor => {
  const graphConfig = new GraphConfig();
  registerCommands(editor, graphConfig.state);
  editor.controller.load('graph-config', graphConfig);
};
