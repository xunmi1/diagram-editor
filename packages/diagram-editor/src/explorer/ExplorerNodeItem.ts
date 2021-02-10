import { Graph, Node } from '@antv/x6';
import { grid } from '@antv/x6/es/layout/grid';
import ResizeObserver from 'resize-observer-polyfill';
import { throttle, lazyTask } from '@diagram-editor/shared';
import { ExplorerItem, DragEvent } from './ExplorerItem';
import { Observer } from '@/utils';

interface DOMRectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface LayoutOptions {
  columns: number;
  columnWidth?: number | 'auto' | 'compact';
  rowHeight?: number | 'auto' | 'compact';
  dx?: number;
  dy?: number;
  center?: boolean;
}

// 根据参数，拦截相同参数的函数调用
const unique = <T, F extends (...params: any[]) => void>(func: F) => {
  let cacheParams: string;
  return function (this: T, ...args: Parameters<F>) {
    const str = JSON.stringify(args);
    if (cacheParams === str) return;
    cacheParams = str;
    func.apply(this, args);
  };
};

// 默认间距
const DEFAULT_SPACING = 16;
// 默认每行节点数量
const DEFAULT_COLUMNS = 3;

const defaultLayoutOptions: LayoutOptions = {
  columns: DEFAULT_COLUMNS,
  dx: DEFAULT_SPACING,
  dy: DEFAULT_SPACING,
};

const NODE_EVENT_MOUSEDOWN = 'cell:mousedown';
const EVENT_TYPE_WILL_DRAG = Symbol('WILL_DRAG');
const EVENT_TYPE_DID_RESIZE = Symbol('DID_RESIZE');

export class ExplorerNodeItem extends ExplorerItem {
  public readonly title: string;
  public graph: Graph | undefined;

  private _container?: HTMLElement;
  private readonly _layout: { cellWidth: number };

  constructor(options?: Partial<{ title: string; layout: { cellWidth?: number } }>) {
    super();
    const title = options?.title;
    if (title) this.title = title;
    this._layout = { cellWidth: 100, ...options?.layout };

    this.applyLayout = unique(lazyTask(this.applyLayout));

    this._observeContainerSize();
    this._bindResetEvent();
    this._bindDragEvent();
  }

  mount(container: HTMLElement): void {
    this._container = container;
    this.graph = new Graph({
      container,
      interacting: false,
      preventDefaultContextMenu: false,
      preventDefaultBlankAction: false,
    });
    this.fitToContent();
  }

  unmount() {
    this.graph?.dispose();
    this.graph = undefined;
    this._container = undefined;
  }

  load(...nodeList: (Node.Metadata | Node)[]) {
    const loadNode = () => {
      nodeList.forEach(node => this.graph?.addNode(<Node>node));
      this.applyLayout();
    };
    const disposable = this.onDidMount(loadNode);
    this.onWillUnmount(() => disposable.dispose());
  }

  /** 设置布局 */
  applyLayout(options?: LayoutOptions) {
    const graph = this.graph;
    if (graph) {
      // `resizeToFit` 必须是 `false`, 否则多次调用 `applyLayout` 时，会不断缩小节点
      const layout = { ...defaultLayoutOptions, ...options, resizeToFit: false };
      if (layout.columns < 1 || layout.columns > graph.getCellCount()) return;
      grid(graph.model as any, layout);
      this.fitToContent();
    }
  }

  fitToContent() {
    this.graph?.fitToContent({ gridHeight: 1, gridWidth: 1, padding: DEFAULT_SPACING });
  }

  onWillDrag(callback: DragEvent) {
    return this.on(EVENT_TYPE_WILL_DRAG, callback);
  }

  onDidResize(callback: Observer<DOMRectReadOnly>) {
    return this.on(EVENT_TYPE_DID_RESIZE, callback);
  }

  /** 传递拖拽事件 */
  private _bindDragEvent() {
    this.onDidMount(() => {
      this.graph?.on(NODE_EVENT_MOUSEDOWN, args => {
        this.emit(EVENT_TYPE_WILL_DRAG, { cell: args.cell, event: args.e });
      });
    });
    this.onWillUnmount(() => {
      this.graph?.off(NODE_EVENT_MOUSEDOWN);
    });
  }
  /** 观察容器尺寸变化 */
  private _observeContainerSize() {
    const resizeObserver = new ResizeObserver(
      throttle(entries => {
        this.emit(EVENT_TYPE_DID_RESIZE, entries[0].contentRect);
      }, 160)
    );
    this.onDidMount(() => {
      const element = this._container?.parentElement;
      if (element) resizeObserver.observe(element);
    });
    this.onWillUnmount(() => resizeObserver.disconnect());
  }
  /** 根据尺寸变化，自动调整布局 */
  private _bindResetEvent() {
    this.onDidResize(({ width, height }) => {
      if (width && height && this.graph) {
        const columns = Math.floor(width / this._layout.cellWidth);
        this.applyLayout({ columns });
      }
    });
  }
}
