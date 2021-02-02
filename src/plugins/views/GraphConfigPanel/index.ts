import { createApp, reactive, App } from 'vue';
import antd from '@/antd';
import { ControllerItem } from '@/controller';
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

export default class GraphConfigPanel extends ControllerItem {
  title = '画布属性';

  private app: App;
  private state: State;
  private editor: DiagramEditor;

  created(editor: DiagramEditor) {
    this.editor = editor;
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

  activate(editor: DiagramEditor): boolean {
    return !editor.activeCell;
  }
}
