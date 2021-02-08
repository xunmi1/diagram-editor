import { createApp, App as VueApp } from 'vue';
import type { ComponentPublicInstance } from '@vue/runtime-core';
import type { Graph, Cell } from '@antv/x6';
import App from '@/App.vue';
import antd from '@/antd';
import { useOnceWatch } from '@/use';
import { EditorOptions, Plugin } from '@/interfaces';

import { Explorer } from '@/explorer';
import { Controller } from '@/controller';
import { Menubar } from '@/menubar';
import { ContextMenu } from '@/contextMenu';
import { Toolbar } from '@/toolbar';
import { Statusbar } from '@/statusbar';

import { Subject, Observer, CommandsRegistry } from '@/utils';
import { warn, merge } from '@diagram-editor/shared';
import { EventType } from '@/constants';
import { defaultOptions } from '@/defaultOptions';
import { bindActiveEvent, bindMouseEvent } from '@/events';

class DiagramEditor extends Subject {
  public readonly explorer: Explorer;
  public readonly controller: Controller;
  public readonly commands: CommandsRegistry;
  public readonly menubar: Menubar;
  public readonly contextMenu: ContextMenu;
  public readonly toolbar: Toolbar;
  public readonly statusbar: Statusbar;

  private _options: EditorOptions;
  private readonly _installedPlugins: Set<Plugin>;
  private _rootContainer?: string | HTMLElement;

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

    this._app = createApp(App, { editor: this }).use(antd);
  }

  get options(): EditorOptions {
    return { ...this._options };
  }

  /**
   * 更新配置
   * @description options 属于 object, 为便于使用而合并选项，不合适定义为 setter.
   */
  update(options: Omit<EditorOptions, 'graph'>) {
    this._options = merge(this._options, options);
    // eslint-disable-next-line
    const { graph, ...rest } = this._options;
    this.emit(EventType.EDITOR_DID_CHANGE_OPTIONS, rest);
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

  mount(rootContainer: string | HTMLElement) {
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
    this._rootContainer = undefined;
  }

  onDidMount(callback: Observer<Graph>) {
    if (this._graph) callback(this.graph as Graph);
    return this.once(EventType.EDITOR_DID_MOUNT, callback);
  }

  onDidUpdate(callback: Observer<Omit<EditorOptions, 'graph'>>) {
    return this.on<EditorOptions>(EventType.EDITOR_DID_CHANGE_OPTIONS, callback);
  }

  onDidChangeActiveCell(callback: Observer<Cell | undefined>) {
    return this.on(EventType.EDITOR_DID_CHANGE_ACTIVE_CELL, callback);
  }

  onDidChangeMouseCell(callback: Observer<Cell | undefined>) {
    return this.on(EventType.EDITOR_DID_CHANGE_MOUSE_CELL, callback);
  }

  // Plugin API
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