import { onBeforeUnmount, shallowRef } from 'vue';
import type { ToolbarItem } from '@/toolbar';

export const useToolItem = (item: ToolbarItem) => {
  const toolItem = shallowRef(item);
  const disposable = item.onDidChangeState(() => (toolItem.value = item));

  onBeforeUnmount(() => disposable.dispose());

  return toolItem;
};
