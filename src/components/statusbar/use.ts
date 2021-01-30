import { onBeforeUnmount, shallowRef } from 'vue';
import type { StatusbarItem } from '@/statusbar';

export const useStatusItem = (item: StatusbarItem) => {
  const statusItem = shallowRef(item);
  const disposable = item.onDidChangeState(() => (statusItem.value = item));

  onBeforeUnmount(() => disposable.dispose());

  return statusItem;
};
