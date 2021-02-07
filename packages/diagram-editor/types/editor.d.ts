import type { Graph, Cell } from '@antv/x6';
import { EditorOptions, Plugin } from './interfaces';
import { Explorer } from './explorer';
import { Controller } from './controller';
import { Menubar } from './menubar';
import { ContextMenu } from './contextMenu';
import { Toolbar } from './toolbar';
import { Statusbar } from './statusbar';
import { Subject, Disposable, Observer, CommandsRegistry } from './utils';

declare class DiagramEditor extends Subject {
  readonly explorer: Explorer;
  readonly controller: Controller;
  readonly commands: CommandsRegistry;
  readonly menubar: Menubar;
  readonly contextMenu: ContextMenu;
  readonly toolbar: Toolbar;
  readonly statusbar: Statusbar;

  constructor(options?: EditorOptions);
  get options(): EditorOptions;
  /**
   * 更新配置
   * @description options 属于 object, 为便于使用而合并选项，不合适定义为 setter.
   */
  update(options: Omit<EditorOptions, 'graph'>): void;
  get graph(): Graph | undefined;
  get activeCell(): Cell<Cell.Properties> | undefined;
  get mouseCell(): Cell<Cell.Properties> | undefined;
  mount(rootContainer: string | HTMLElement): Promise<Graph>;
  unmount(rootContainer?: string | HTMLElement | undefined): void;
  onDidMount(callback: Observer<Graph>): Disposable;
  onDidUpdate(callback: Observer<Omit<EditorOptions, 'graph'>>): Disposable;
  onDidChangeActiveCell(callback: Observer<Cell | undefined>): Disposable;
  onDidChangeMouseCell(callback: Observer<Cell | undefined>): Disposable;
  use(plugin: Plugin): this;
}
export default DiagramEditor;
