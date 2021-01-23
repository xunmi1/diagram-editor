import { createApp, reactive, App } from 'vue';
import antd from '@/antd';
import { ConfigPanel } from '@/controller';
import Panel from './Panel.vue';
import { DiagramEditor } from '@/interfaces';
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
  editor.onMounted(async () => {
    const options = editor.graph.options;
    state.gridVisible = options.grid.visible;
    state.gridSize = editor.graph?.getGridSize();
    state.backgroundColor = (options.background ? options.background.color : null) ?? 'transparent';
    state.scrollerEnable = options.scroller.enabled ?? false;
    state.scrollerPannable = options.scroller.pannable ?? false;
  });
};

export default class GraphConfigPanel extends ConfigPanel {
  static title = '画布属性';

  private app: App;
  private state: State;

  created() {
    const editor = this.editor;
    const state = reactive<State>({
      gridVisible: true,
      gridSize: 10,
      backgroundColor: 'transparent',
      scrollerEnable: true,
      scrollerPannable: false,
    });
    initState(editor, state);
    registerCommands(editor, state);

    this.state = state;
  }

  mount(container: Element) {
    const rootProps: RootProps = { editor: this.editor, state: this.state };
    this.app = createApp(Panel, rootProps).use(antd);
    this.app.mount(container);
  }

  unmount(container: Element) {
    this.app.unmount(container);
  }

  activate(cell: any): boolean {
    return !cell;
  }
}
