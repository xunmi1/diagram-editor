import type { Node } from '@antv/x6';

export declare interface LayoutOptions extends Node.SetPositionOptions {
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
