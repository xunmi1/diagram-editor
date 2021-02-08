<template>
  <ADropdown v-model:visible="visible" :trigger="['contextmenu']" :align="{ offset: [6, 6] }">
    <span tabindex="-1" :style="position" class="editor-context-menu-trigger"></span>
    <template #overlay>
      <Menu :list="menuList" :groups="groups" @click="executeCommand" @contextmenu.prevent />
    </template>
  </ADropdown>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive, computed, onBeforeUnmount, shallowRef } from 'vue';
import { useEditor, useGlobalGraph } from '@/use';
import { Menu } from '../menu';
import { lazyTask } from '@diagram-editor/shared';
import type { ContextMenu, ContextMenuItem } from '@/contextMenu';

type MenuList = Map<string, ContextMenuItem>;

const useMenuList = () => {
  const { contextMenu } = useEditor();
  // 使用 shallowRef 会无法触发顶级菜单 `visible` 变化
  const menuList = ref<MenuList>(new Map([...contextMenu]));
  const disposable = contextMenu.onDidLoad(
    lazyTask(() => {
      menuList.value = new Map([...contextMenu]);
    })
  );

  onBeforeUnmount(() => disposable.dispose());

  return menuList;
};

const useGroups = (contextMenu: ContextMenu) => {
  const groups = shallowRef(contextMenu.groups);
  const disposable = contextMenu.onDidChangeGroups(() => {
    groups.value = contextMenu.groups;
  });
  onBeforeUnmount(() => disposable.dispose());

  return groups;
};

const findActive = () => {
  const editor = useEditor();

  const filter = (list: MenuList) => {
    list.forEach(item => {
      const active = item.activate?.(editor) ?? true;
      if (item.visible !== active) item.visible = active;
      if (active && item.children?.size) filter(item.children);
    });
  };

  return filter;
};

export default defineComponent({
  name: 'ContextMenu',
  components: {
    Menu,
  },
  setup() {
    const visible = ref(false);
    const pos = reactive({ x: 0, y: 0 });
    const position = computed(() => ({ top: `${pos.y}px`, left: `${pos.x}px` }));
    const close = () => {
      if (visible.value) visible.value = false;
    };
    const open = ({ e }: { e: { pageX: number; pageY: number } }) => {
      [pos.x, pos.y] = [e.pageX, e.pageY];
      visible.value = true;
    };

    useGlobalGraph(graph => {
      graph.on('cell:click', close);
      graph.on('blank:click', close);
      graph.on('cell:contextmenu', open);
      graph.on('blank:contextmenu', open);
    });

    const { contextMenu, commands } = useEditor();

    const groups = useGroups(contextMenu);

    const executeCommand = async (key: string) => {
      const item = contextMenu.get(key);
      if (item?.command) await commands.execute(item.command, item);
      close();
    };

    // 过滤未激活的菜单
    const filter = findActive();
    const menuList = useMenuList();

    watch([visible, menuList], ([bool]) => {
      if (!bool) return;
      filter(menuList.value);
    });

    return { menuList, groups, executeCommand, visible, position };
  },
});
</script>

<style lang="less">
.editor-context-menu {
  &-trigger {
    position: absolute;
    visibility: hidden;
    z-index: -1;
  }
}
</style>
