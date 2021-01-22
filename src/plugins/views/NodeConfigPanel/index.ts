import { createApp, reactive, App } from 'vue';
import antd from '@/antd';
import { Node } from '@antv/x6';
import { ConfigPanel } from '@/controller';
import { EventType } from '@/constants';
import { DiagramEditor } from '@/interfaces';
import { registerCommands } from './commands';
import Panel from './Panel.vue';

export interface State {
  label?: string;
  color?: string;
  fontSize?: string;
}

export interface RootProps extends Record<string, unknown> {
  state: State;
  editor: DiagramEditor;
}

const initState = (editor: DiagramEditor, state: State) => {
  editor.on(EventType.EDITOR_MOUNTED, async () => {});
};

export default class NodeConfigPanel extends ConfigPanel {
  static title = '节点属性';

  private app: App;
  private state: State;

  created() {
    const editor = this.editor;
    const state = reactive<State>({});
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
    return cell instanceof Node;
  }
}
