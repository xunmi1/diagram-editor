import { onBeforeUnmount, shallowRef, toRaw, triggerRef } from 'vue';
import type { StatusbarItem } from '../../statusbar';

export const useStatusItem = (item: StatusbarItem) => {
  const statusItem = shallowRef(item);
  const disposable = toRaw(item).onDidChangeState(() => triggerRef(statusItem));

  onBeforeUnmount(() => disposable.dispose());

  return statusItem;
};
