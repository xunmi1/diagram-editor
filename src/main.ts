import { createApp } from 'vue';
import type { Graph } from '@antv/x6';
import App from '@/App.vue';
import antd from '@/antd';
import { useOnceWatch } from '@/use';
import { EditorOptions, Plugin } from '@/interfaces';
import { ExplorerItem, Explorer, ExplorerNodeItem } from '@/explorer';
import { ControllerItem, Controller } from '@/controller';
import { Menubar, MenubarItem } from '@/menubar';
import { Subject, CommandsRegistry, warn, Observer } from '@/utils';
import { EventType } from '@/constants';

export { ExplorerItem, ExplorerNodeItem, ControllerItem };
export type { MenubarItem };

export * from '@/plugins';

class DiagramEditor extends Subject {
  public readonly explorer: Explorer;
  public readonly controller: Controller;
  public readonly commands: CommandsRegistry;
  public readonly menubar: Menubar;
  public graph: Graph;
  private readonly options: EditorOptions;
  private readonly installedPlugins: Set<Plugin>;

  constructor(options: EditorOptions = {}) {
    super();
    this.options = options;
    this.explorer = new Explorer();
    this.controller = new Controller();
    this.commands = new CommandsRegistry();
    this.menubar = new Menubar();
    this.installedPlugins = new Set();
  }

  mount(rootContainer: string | Element) {
    const app = createApp(App, { options: this.options.graph, editor: this });
    const vm = app.use(antd).mount(rootContainer) as any;

    return new Promise<void>(resolve => {
      useOnceWatch(() => {
        if (vm.graph) {
          this.graph = vm.graph;
          resolve();
          this.emit(EventType.EDITOR_MOUNTED);
        }

        return !!vm.graph;
      });
    });
  }

  onDidMount(callback: Observer<void>) {
    return this.once(EventType.EDITOR_MOUNTED, callback);
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
