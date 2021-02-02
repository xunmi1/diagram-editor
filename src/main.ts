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
import { ContextMenu, ContextMenuItem, ContextMenuItemOptions } from '@/contextMenu';
import { Toolbar, ToolbarItem, ToolbarItemOptions } from '@/toolbar';
import { Statusbar, StatusbarItem, StatusbarItemOptions } from '@/statusbar';
import { Subject, Observer, CommandsRegistry, warn, merge } from '@/utils';
import { EventType } from '@/constants';
import { defaultOptions } from '@/defaultOptions';
import { bindActiveEvent, bindMouseEvent } from '@/events';

export { ExplorerItem, ExplorerNodeItem, ControllerItem, MenubarItem, ContextMenuItem, ToolbarItem, StatusbarItem };
export * from '@/plugins';

export type {
  DragEvent,
  LayoutOptions,
  MenubarItemOptions,
  ContextMenuItemOptions,
  ToolbarItemOptions,
  StatusbarItemOptions,
};
export type { Observer, Disposable } from '@/utils';
export * from '@/interfaces';

class DiagramEditor extends Subject {
  public readonly explorer: Explorer;
  public readonly controller: Controller;
  public readonly commands: CommandsRegistry;
  public readonly menubar: Menubar;
  public readonly contextMenu: ContextMenu;
  public readonly toolbar: Toolbar;
  public readonly statusbar: Statusbar;

  private readonly _options: EditorOptions;
  private readonly _installedPlugins: Set<Plugin>;
  private _rootContainer?: string | Element;

  private _graph?: Graph;
  private _activeCell?: Cell;
  private _mouseCell?: Cell;
  private _app?: VueApp;

  constructor(options?: EditorOptions) {
    super();
    this.explorer = new Explorer();
    this.controller = new Controller();
    this.commands = new CommandsRegistry();
    this.menubar = new Menubar();
    this.contextMenu = new ContextMenu();
    this.toolbar = new Toolbar();
    this.statusbar = new Statusbar();

    this._options = merge(defaultOptions, options);
    this._installedPlugins = new Set();

    this._app = createApp(App, { options: this._options, editor: this }).use(antd);
  }

  get options() {
    return { ...this._options };
  }

  get graph() {
    return this._graph;
  }

  get activeCell() {
    return this._activeCell;
  }

  get mouseCell() {
    return this._mouseCell;
  }

  mount(rootContainer: string | Element) {
    this._rootContainer = rootContainer;
    const vm = this._app?.mount(rootContainer) as ComponentPublicInstance<{}, {}, { graph: Graph }>;

    return new Promise<Graph>(resolve => {
      useOnceWatch(() => {
        if (vm.graph) {
          this._graph = vm.graph as Graph;
          bindActiveEvent(this._graph, cell => {
            this._activeCell = cell;
            this.emit(EventType.EDITOR_DID_CHANGE_ACTIVE_CELL, this._activeCell);
          });

          bindMouseEvent(this._graph, cell => {
            this._mouseCell = cell;
            this.emit(EventType.EDITOR_DID_CHANGE_MOUSE_CELL, this._mouseCell);
          });

          this.emit(EventType.EDITOR_DID_MOUNT, vm.graph);
          resolve(vm.graph);
        }

        return !!vm.graph;
      });
    });
  }

  unmount(rootContainer = this._rootContainer) {
    this._graph?.dispose();
    this._app?.unmount(rootContainer);
    this._app = undefined;
  }

  onDidMount(callback: Observer<Graph>) {
    if (this._graph) callback(this.graph as Graph);
    return this.once(EventType.EDITOR_DID_MOUNT, callback);
  }

  onDidChangeActiveCell(callback: Observer<Cell | undefined>) {
    return this.on(EventType.EDITOR_DID_CHANGE_ACTIVE_CELL, callback);
  }

  onDidChangeMouseCell(callback: Observer<Cell | undefined>) {
    return this.on(EventType.EDITOR_DID_CHANGE_MOUSE_CELL, callback);
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
}

export default DiagramEditor;
