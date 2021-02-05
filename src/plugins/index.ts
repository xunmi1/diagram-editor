import { Plugin } from '@/interfaces';
import { graphConfigPlugin } from './graphConfig';
import { TopMenuPlugin } from './topMenu';
import { nodeCountPlugin, edgeCountPlugin } from './statusbar';
import { historyPlugin } from './history';
import { ActionsPlugin } from './actions';
import { contextMenuPlugin } from '@/plugins/contextMenu';

export * from './statusbar';
export * from './actions';
export * from './history';

export const builtInPlugin: Plugin = editor => {
  graphConfigPlugin(editor);

  TopMenuPlugin(editor);
  historyPlugin(editor);
  ActionsPlugin(editor);

  contextMenuPlugin(editor);

  nodeCountPlugin(editor);
  edgeCountPlugin(editor);
};
