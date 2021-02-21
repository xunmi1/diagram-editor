import type { Cell, Graph } from '@antv/x6';
import type { Observer } from './utils';

export const bindMouseEvent = (graph: Graph, callback: Observer<Cell | undefined>) => {
  let mouseCell: Cell | undefined;
  const handler = (cell?: Cell) => {
    if (cell?.id === mouseCell?.id) return;
    mouseCell = cell;
    callback(mouseCell);
  };
  graph.on('cell:mouseenter', ({ cell }) => handler(cell));
  graph.on('cell:mouseleave', () => handler());
};

export const bindActiveEvent = (graph: Graph, callback: Observer<Cell | undefined>) => {
  let activeCell: Cell | undefined;
  const handler = ({ cell }: { cell?: Cell }) => {
    if (cell?.id === activeCell?.id) return;
    activeCell = cell;
    callback(activeCell);
  };
  graph.on('cell:click', handler);
  graph.on('blank:click', handler);
};
