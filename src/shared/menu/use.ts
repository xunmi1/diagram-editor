import { onBeforeUnmount, shallowRef, triggerRef, toRaw, computed, Ref } from 'vue';
import { MenuItem } from '@/menu';
import { GROUP_TAG } from '@/constants';
import { Disposable } from '@/interfaces';

export const useMenuItem = (menu: MenuItem) => {
  const disposableList: Disposable[] = [];

  /**
   * `visible` 属性涉及到分组的计算,
   * 子菜单的 `visible` 变化无法触发父级组件的菜单列表的依赖变化, 需要手动监听，触发父级组件的依赖变化
   */
  const triggerChild = (child: MenuItem) => {
    const disposable = child.onDidChangeVisible(() => triggerRef(menuItem));
    disposableList.push(disposable);
  };

  /**
   * 当 menu 没有子节点时，新增子节点时，无法触发 menu 相关依赖及视图更新
   * 通过绑定 onDidAppendChild，手动触发
   */
  const menuItem = shallowRef(toRaw(menu));
  menuItem.value.children?.forEach(triggerChild);

  const disposeAppend = menu.onDidAppendChild(({ child }) => {
    triggerRef(menuItem);
    triggerChild(child);
  });
  const disposeState = menu.onDidChangeState(() => triggerRef(menuItem));

  disposableList.push(disposeAppend, disposeState);

  onBeforeUnmount(() => {
    disposableList.forEach(disposable => disposable.dispose());
  });

  return menuItem;
};

export const useDivider = (groups: Ref<string[]>, list: Ref<Map<string, MenuItem> | undefined>) => {
  const visibleList = computed(() => {
    const children = list.value;
    return groups.value.filter(key => key !== GROUP_TAG && children?.get(key)?.visible);
  });

  const has = (key: string) => {
    const list = visibleList.value;
    const index = list.indexOf(key);
    if (index === list.length - 1) return false;

    const origin = groups.value;
    const next = list[index + 1];
    const start = origin.indexOf(key);
    const end = origin.indexOf(next);
    return origin.slice(start + 1, end).includes(GROUP_TAG);
  };

  return { has, visibleList };
};
