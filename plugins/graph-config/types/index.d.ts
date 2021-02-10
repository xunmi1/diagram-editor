import { Plugin } from '@diagram-editor/diagram-editor';
import { Background } from '@antv/x6/es/registry';

export interface GridOptions {
  size?: number;
  visible?: boolean;
}

export interface ScrollerOptions {
  enabled: boolean;
  pannable: boolean;
}

export interface BackgroundOptions extends Background.Options {}

export declare const CommandId: {
  SET_GRID: symbol;
  SET_BACKGROUND: symbol;
  SET_SCROLLER: symbol;
};

export interface PluginOptions {
  key: string;
  title?: string;
}

export declare const graphConfigPlugin: (options: PluginOptions) => Plugin;
