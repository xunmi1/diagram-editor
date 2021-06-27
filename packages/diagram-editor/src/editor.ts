import { createApp, App as VueApp, ComponentPublicInstance } from 'vue';
import type { Graph } from '@antv/x6';
import type { Cell } from '@antv/x6/src/model/cell';
import { warn, merge } from '@diagram-editor/shared';

import App from './App.vue';
import antd from './antd';
import { useOnceWatch } from './use';
import { EditorOptions, Plugin } from './interfaces';

import { Explorer } from './explorer';
import { Controller } from './controller';
import { Menubar } from './menubar';
import { ContextMenu } from './contextMenu';
import { Toolbar } from './toolbar';
import { Statusbar } from './statusbar';

import { Subject, Observer, CommandsRegistry } from './utils';
import { defaultOptions } from './defaultOptions';
import { bindActiveEvent, bindMouseEvent } from './events';

const EDITOR_DID_MOUNT = Symbol('DID_MOUNT');
const EDITOR_DID_CHANGE_ACTIVE_CELL = Symbol('DID_CHANGE_ACTIVE_CELL');
const EDITOR_DID_CHANGE_MOUSE_CELL = Symbol('DID_CHANGE_MOUSE_CELL');
const EDITOR_DID_CHANGE_OPTIONS = Symbol('DID_CHANGE_OPTIONS');

interface EditorEvents extends Record<any, any> {
  [EDITOR_DID_MOUNT]: Graph;
  [EDITOR_DID_CHANGE_ACTIVE_CELL]: Cell | undefined;
  [EDITOR_DID_CHANGE_MOUSE_CELL]: Cell | undefined;
  [EDITOR_DID_CHANGE_OPTIONS]: Omit<EditorOptions, 'graph'>;
}

class DiagramEditor extends Subject<EditorEvents> {
  public readonly explorer: Explorer;
  public readonly controller: Controller;
  public readonly commands: CommandsRegistry;
  public readonly menubar: Menubar;
  public readonly contextMenu: ContextMenu;
  public readonly toolbar: Toolbar;
  public readonly statusbar: Statusbar;

  #options: EditorOptions;
  readonly #installedPlugins: Set<Plugin>;

  #graph?: Graph;
  #activeCell: Cell | undefined;
  #mouseCell: Cell | undefined;
  #app?: VueApp;

  constructor(options?: EditorOptions) {
    super();
    this.explorer = new Explorer();
    this.controller = new Controller();
    this.commands = new CommandsRegistry();
    this.menubar = new Menubar();
    this.contextMenu = new ContextMenu();
    this.toolbar = new Toolbar();
    this.statusbar = new Statusbar();

    this.#options = merge(defaultOptions, options);
    this.#installedPlugins = new Set();

    this.#app = createApp(App, { editor: this }).use(antd);
  }

  get options(): EditorOptions {
    return { ...this.#options };
  }

  get graph() {
    return this.#graph;
  }

  get activeCell() {
    return this.#activeCell;
  }

  get mouseCell() {
    return this.#mouseCell;
  }

  mount(rootContainer: string | HTMLElement) {
    const vm = this.#app?.mount(rootContainer) as ComponentPublicInstance<unknown, unknown, { graph: Graph }>;

    return new Promise<Graph>(resolve => {
      useOnceWatch(() => {
        if (vm.graph) {
          this.#graph = vm.graph as Graph;
          bindActiveEvent(this.#graph, cell => {
            this.#activeCell = cell;
            this.emit(EDITOR_DID_CHANGE_ACTIVE_CELL, this.#activeCell);
          });

          bindMouseEvent(this.#graph, cell => {
            this.#mouseCell = cell;
            this.emit(EDITOR_DID_CHANGE_MOUSE_CELL, this.#mouseCell);
          });

          this.emit(EDITOR_DID_MOUNT, this.#graph!);
          resolve(this.#graph);
        }

        return !!vm.graph;
      });
    });
  }

  unmount() {
    this.dispose();
    this.#app?.unmount();
    this.#app = undefined;
  }

  dispose() {
    super.dispose();
    this.#graph?.dispose();
  }

  /**
   * 更新配置
   * @description options 属于 object, 为便于使用而合并选项，不合适定义为 setter.
   */
  update(options: Omit<EditorOptions, 'graph'>) {
    this.#options = merge(this.#options, options);
    // eslint-disable-next-line
    const { graph, ...rest } = this.#options;
    this.emit(EDITOR_DID_CHANGE_OPTIONS, rest);
  }

  onDidMount(callback: Observer<Graph>) {
    return this.once(EDITOR_DID_MOUNT, callback);
  }
  // 配置项更新
  onDidUpdate(callback: Observer<Omit<EditorOptions, 'graph'>>) {
    return this.on(EDITOR_DID_CHANGE_OPTIONS, callback);
  }

  onDidChangeActiveCell(callback: Observer<Cell | undefined>) {
    return this.on(EDITOR_DID_CHANGE_ACTIVE_CELL, callback);
  }

  onDidChangeMouseCell(callback: Observer<Cell | undefined>) {
    return this.on(EDITOR_DID_CHANGE_MOUSE_CELL, callback);
  }

  // Plugin API
  use(plugin: Plugin) {
    const installed = this.#installedPlugins;
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
