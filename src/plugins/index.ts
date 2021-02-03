import { Plugin } from '@/interfaces';
import { graphConfigPlugin } from './graphConfig';
import { TopMenuPlugin } from './topMenu';
import { nodeCountPlugin, edgeCountPlugin } from './statusbar';
import { historyPlugin } from './history';
import { contextMenuPlugin } from '@/plugins/contextMenu';

export * from './statusbar';

export const builtInPlugin: Plugin = editor => {
  graphConfigPlugin(editor);
  TopMenuPlugin(editor);
  nodeCountPlugin(editor);
  edgeCountPlugin(editor);
  historyPlugin(editor);
  contextMenuPlugin(editor);
};
