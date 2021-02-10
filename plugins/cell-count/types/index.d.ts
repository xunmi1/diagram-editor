import { Plugin } from '@diagram-editor/diagram-editor';
export interface PluginOptions {
  key: string;
}
export declare const nodeCountPlugin: (options: PluginOptions) => Plugin;
export declare const edgeCountPlugin: (options: PluginOptions) => Plugin;
