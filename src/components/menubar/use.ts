import { onBeforeUnmount, shallowRef } from 'vue';
import type { MenubarItem } from '@/menubar';

export const useMenuItem = (menu: MenubarItem) => {
  /**
   * 当 menu 没有子节点时，新增子节点时，无法触发 menu 相关依赖及视图更新
   * 通过绑定 onDidAppendChild，手动触发
   */
  const menuItem = shallowRef(menu);
  const disposableAppend = menu.onDidAppendChild(() => (menuItem.value = menu));
  const disposableState = menu.onDidChangeState(() => (menuItem.value = menu));

  onBeforeUnmount(() => {
    disposableAppend.dispose();
    disposableState.dispose();
  });

  return menuItem;
};
