import { onBeforeUnmount, shallowRef, triggerRef, toRaw } from 'vue';
import { Menu } from '@/interfaces';

export const useMenuItem = (menu: Menu) => {
  /**
   * 当 menu 没有子节点时，新增子节点时，无法触发 menu 相关依赖及视图更新
   * 通过绑定 onDidAppendChild，手动触发
   */
  const menuItem = shallowRef(toRaw(menu));
  const disposableAppend = menu.onDidAppendChild(() => {
    triggerRef(menuItem);
  });
  const disposableState = menu.onDidChangeState(() => {
    triggerRef(menuItem);
  });

  onBeforeUnmount(() => {
    disposableAppend.dispose();
    disposableState.dispose();
  });

  return menuItem;
};
