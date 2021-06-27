import type { Graph } from '@antv/x6';
import type { Cell } from '@antv/x6/es/model/cell';
import type { Observer } from './utils';

export const bindMouseEvent = (graph: Graph, callback: Observer<Cell | undefined>) => {
  let mouseCell: Cell | undefined;
  const handler = (event: { cell?: Cell } = {}) => {
    if (event.cell?.id === mouseCell?.id) return;
    mouseCell = event.cell;
    callback(mouseCell);
  };
  // @ts-ignore
  graph.on('cell:mouseenter', handler);
  graph.on('cell:mouseleave', handler);
};

export const bindActiveEvent = (graph: Graph, callback: Observer<Cell | undefined>) => {
  let activeCell: Cell | undefined;
  const handler = (event: { cell?: Cell } = {}) => {
    if (event.cell?.id === activeCell?.id) return;
    activeCell = event.cell;
    callback(activeCell);
  };
  graph.on('cell:click', handler);
  graph.on('blank:click', handler);
};
