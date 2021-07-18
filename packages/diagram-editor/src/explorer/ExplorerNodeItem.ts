import { Graph, Node } from '@antv/x6';
import { throttle, lazyTask } from '@diagram-editor/shared';
import { grid, LayoutOptions } from './grid';
import { ExplorerItem, DragEvent, ExplorerEvents } from './ExplorerItem';
import { Observer } from '../utils';

export type { LayoutOptions };

// 根据参数，拦截相同参数的函数调用
const unique = <T extends (...params: any[]) => void>(func: T) => {
  let cacheParams: string;
  return function fn(this: unknown, ...args: Parameters<T>) {
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

interface Events extends ExplorerEvents {
  [EVENT_TYPE_WILL_DRAG]: Parameters<DragEvent>[0];
  [EVENT_TYPE_DID_RESIZE]: DOMRectReadOnly;
}

export class ExplorerNodeItem extends ExplorerItem<Events> {
  public readonly title: string;

  public graph: Graph | undefined;

  #container?: HTMLElement;

  #containerRect?: DOMRectReadOnly;

  readonly #layout: { cellWidth: number };

  constructor(options?: Partial<{ title: string; layout: { cellWidth?: number } }>) {
    super();
    const title = options?.title;
    if (title) this.title = title;
    this.#layout = { cellWidth: 100, ...options?.layout };

    this.applyLayout = lazyTask(this.applyLayout);

    this.#observeContainerSize();
    this.#bindResetEvent();
    this.#bindDragEvent();
  }

  mount(container: HTMLElement): void {
    this.#container = container;
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
    this.#container = undefined;
  }

  load(...nodeList: (Node.Metadata | Node)[]) {
    const loadNode = () => {
      this.graph?.addNodes(nodeList);
      const columns = this.#calcColumns();
      if (columns) this.applyLayout({ columns });
    };

    if (this.graph) loadNode();
    else {
      const disposable = this.onDidMount(loadNode);
      this.onWillUnmount(() => disposable.dispose());
    }
  }

  /** 设置布局 */
  applyLayout(options?: LayoutOptions) {
    const graph = this.graph;
    if (graph) {
      // `resizeToFit` 必须是 `false`, 否则多次调用 `applyLayout` 时，会不断缩小节点
      const layout = { ...defaultLayoutOptions, ...options, resizeToFit: false };
      const columns = layout.columns ?? 0;
      if (columns < 1) return;
      grid(graph.model, layout);
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
  #bindDragEvent() {
    this.onDidMount(() => {
      this.graph?.on(NODE_EVENT_MOUSEDOWN, args => {
        // @ts-ignore
        this.emit(EVENT_TYPE_WILL_DRAG, { cell: args.cell, event: args.e });
      });
    });
    this.onWillUnmount(() => {
      this.graph?.off(NODE_EVENT_MOUSEDOWN);
    });
  }

  /** 观察容器尺寸变化 */
  #observeContainerSize() {
    const resizeObserver = new ResizeObserver(
      throttle(entries => {
        this.emit(EVENT_TYPE_DID_RESIZE, entries[0].contentRect);
      }, 160)
    );
    this.onDidMount(() => {
      const element = this.#container?.parentElement;
      if (element) resizeObserver.observe(element);
    });
    this.onWillUnmount(() => resizeObserver.disconnect());
  }

  #calcColumns() {
    const { width, height } = this.#containerRect ?? {};
    if (width && height && this.graph) {
      return Math.floor(width / this.#layout.cellWidth);
    }
    return 0;
  }

  /** 根据尺寸变化，自动调整布局 */
  #bindResetEvent() {
    const applyLayout = unique(this.applyLayout).bind(this);
    this.onDidResize(rect => {
      this.#containerRect = rect;
      const columns = this.#calcColumns();
      if (columns) applyLayout({ columns });
    });
  }
}
