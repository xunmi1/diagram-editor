import type { Node, Model } from '@antv/x6';

export interface LayoutOptions extends Node.SetPositionOptions {
  columns?: number;
  columnWidth?: number | 'auto' | 'compact';
  rowHeight?: number | 'auto' | 'compact';
  dx?: number;
  dy?: number;
  marginX?: number;
  marginY?: number;
  /**
   * Positions the elements in the center of a grid cell.
   *
   * Default: true
   */
  center?: boolean;
  /**
   * Resizes the elements to fit a grid cell, preserving the aspect ratio.
   *
   * Default: false
   */
  // resizeToFit?: boolean;
}

export const grid = (model: Model, options: LayoutOptions = {}) => {
  const nodes = model.getNodes();
  const columns = options.columns ?? 1;
  const rows = Math.ceil(nodes.length / columns);
  const dx = options.dx ?? 0;
  const dy = options.dy ?? 0;
  const centre = options.center !== false;
  const resizeToFit = options.resizeToFit === true;
  const marginX = options.marginX ?? 0;
  const marginY = options.marginY ?? 0;
  const columnWidths: number[] = [];

  let columnWidth = options.columnWidth;

  if (columnWidth === 'compact') {
    for (let j = 0; j < columns; j += 1) {
      const items = getNodesInColumn(nodes, j, columns);
      columnWidths.push(getMaxDim(items, 'width') + dx);
    }
  } else {
    if (columnWidth == null || columnWidth === 'auto') {
      columnWidth = getMaxDim(nodes, 'width') + dx;
    }

    for (let i = 0; i < columns; i += 1) {
      columnWidths.push(columnWidth);
    }
  }

  const columnLefts = accumulate(columnWidths, marginX);

  const rowHeights: number[] = [];
  let rowHeight = options.rowHeight;
  if (rowHeight === 'compact') {
    for (let i = 0; i < rows; i += 1) {
      const items = getNodesInRow(nodes, i, columns);
      rowHeights.push(getMaxDim(items, 'height') + dy);
    }
  } else {
    if (rowHeight == null || rowHeight === 'auto') {
      rowHeight = getMaxDim(nodes, 'height') + dy;
    }

    for (let i = 0; i < rows; i += 1) {
      rowHeights.push(rowHeight);
    }
  }
  const rowTops = accumulate(rowHeights, marginY);

  nodes.forEach((node, index) => {
    const rowIndex = index % columns;
    const columnIndex = Math.floor(index / columns);
    const col = columnWidths[rowIndex];
    const row = rowHeights[columnIndex];
    const size = node.getSize();

    let cx = 0;
    let cy = 0;

    if (resizeToFit) {
      let width = col - 2 * dx;
      let height = row - 2 * dy;
      const calcHeight = size.height * (size.width ? width / size.width : 1);
      const calcWidth = size.width * (size.height ? height / size.height : 1);
      if (row < calcHeight) width = calcWidth;
      else height = calcHeight;

      node.setSize({ width, height }, options);
    }

    if (centre) {
      cx = (col - size.width) / 2;
      cy = (row - size.height) / 2;
    }

    node.position(columnLefts[rowIndex] + dx + cx, rowTops[columnIndex] + dy + cy, options);
  });
};

const getMaxDim = (nodes: Node[], name: 'width' | 'height') =>
  nodes.reduce((memo, node) => Math.max(node.getSize()[name], memo), 0);

const getNodesInRow = (nodes: Node[], rowIndex: number, columnCount: number) => {
  const res: Node[] = [];
  for (let i = columnCount * rowIndex, ii = i + columnCount; i < ii; i += 1) {
    res.push(nodes[i]);
  }
  return res;
};

const getNodesInColumn = (nodes: Node[], columnIndex: number, columnCount: number) => {
  const res: Node[] = [];
  for (let i = columnIndex, ii = nodes.length; i < ii; i += columnCount) {
    res.push(nodes[i]);
  }
  return res;
};

const accumulate = (items: number[], start = 0) =>
  items.reduce(
    (memo, item, i) => {
      memo.push(memo[i] + item);
      return memo;
    },
    [start]
  );
