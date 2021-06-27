import { onBeforeUnmount, shallowRef, toRaw, triggerRef } from 'vue';
import type { ToolbarItem } from '../../toolbar';

export const useToolItem = (item: ToolbarItem) => {
  const toolItem = shallowRef(item);
  const disposable = toRaw(item).onDidChangeState(() => triggerRef(toolItem));

  onBeforeUnmount(() => disposable.dispose());

  return toolItem;
};
