import { Plugin } from '@diagram-editor/diagram-editor';
export interface PluginOptions {
  key: string;
  title?: string;
}
export declare const graphConfigPlugin: (options: PluginOptions) => Plugin;
