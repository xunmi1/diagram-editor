import { createApp, App as VueApp } from 'vue';
import type { ComponentPublicInstance } from '@vue/runtime-core';
import type { Graph, Cell } from '@antv/x6';
import App from '@/App.vue';
import antd from '@/antd';
import { useOnceWatch } from '@/use';
import { EditorOptions, Plugin } from '@/interfaces';
import { ExplorerItem, Explorer, ExplorerNodeItem, DragEvent, LayoutOptions } from '@/explorer';
import { ControllerItem, Controller } from '@/controller';
import { Menubar, MenubarItem, MenubarItemOptions } from '@/menubar';
import { Statusbar, StatusbarItem, StatusbarItemOptions } from '@/statusbar';
import { Subject, Observer, CommandsRegistry, warn } from '@/utils';
import { EventType } from '@/constants';

export { ExplorerItem, ExplorerNodeItem, ControllerItem, MenubarItem, StatusbarItem };
export * from '@/plugins';

export type { DragEvent, LayoutOptions, MenubarItemOptions, StatusbarItemOptions };
export type { Observer, Disposable } from '@/utils';
export * from '@/interfaces';

const CELL_TRIGGER_TYPE = 'cell:click';
const CELL_CANCEL_TYPE = 'blank:click';

class DiagramEditor extends Subject {
  public readonly explorer: Explorer;
  public readonly controller: Controller;
  public readonly commands: CommandsRegistry;
  public readonly menubar: Menubar;
  public readonly statusbar: Statusbar;

  private readonly _options: EditorOptions;
  private readonly _installedPlugins: Set<Plugin>;

  private _graph: Graph | undefined;
  private _activeCell: Cell | undefined;
  private _app: VueApp;

  constructor(options?: EditorOptions) {
    super();
    this.explorer = new Explorer();
    this.controller = new Controller();
    this.commands = new CommandsRegistry();
    this.menubar = new Menubar();
    this.statusbar = new Statusbar();

    this._options = { ...options };
    this._installedPlugins = new Set();

    this._app = createApp(App, { options: this._options.graph, editor: this }).use(antd);
  }

  get graph() {
    return this._graph;
  }

  get activeCell() {
    return this._activeCell;
  }

  mount(rootContainer: string | Element) {
    const vm = this._app.mount(rootContainer) as ComponentPublicInstance<{}, {}, { graph: Graph }>;

    return new Promise<void>(resolve => {
      useOnceWatch(() => {
        if (vm.graph) {
          this._graph = vm.graph as Graph;
          resolve();
          this._bindActiveCell();
          this.emit(EventType.EDITOR_DID_MOUNT, vm.graph);
        }

        return !!vm.graph;
      });
    });
  }

  onDidMount(callback: Observer<Graph>) {
    if (this._graph) callback(this.graph as Graph);
    return this.once(EventType.EDITOR_DID_MOUNT, callback);
  }

  onDidChangeActiveCell(callback: Observer<Cell | undefined>) {
    return this.on(EventType.EDITOR_DID_CHANGE_ACTIVE_CELL, callback);
  }

  use(plugin: Plugin) {
    const installed = this._installedPlugins;
    if (installed.has(plugin)) {
      warn(`Plugin '${plugin.name}' has already been applied to target editor.`);
    } else {
      plugin(this);
      installed.add(plugin);
    }
    return this;
  }

  private _bindActiveCell() {
    const graph = this._graph as Graph;
    const handler = ({ cell }: { cell?: Cell }) => {
      this._activeCell = cell;
      this.emit(EventType.EDITOR_DID_CHANGE_ACTIVE_CELL, this._activeCell);
    };
    graph.on(CELL_TRIGGER_TYPE, handler);
    graph.on(CELL_CANCEL_TYPE, handler);
  }
}

export default DiagramEditor;
