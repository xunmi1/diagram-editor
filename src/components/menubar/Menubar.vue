<template>
  <section class="editor-menubar-wrapper">
    <div class="editor-menubar-content">
      <div class="editor-menubar-inner">
        <template v-for="key in visibleList" :key="key">
          <MenuItem :item="menubarList.get(key)" :item-key="key" @click="executeCommand" />
          <ADivider v-if="has(key)" type="vertical" />
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, shallowRef } from 'vue';
import { useEditor } from '@/use';
import { lazyTask } from '@/utils';
import type { Menubar, MenubarItem } from '@/menubar';
import MenuItem from './MenuItem.vue';
import { useDivider } from '@/shared';

type MenubarList = Map<string, MenubarItem>;

const useMenubarList = () => {
  const { menubar } = useEditor();
  const menubarList = shallowRef<MenubarList>(new Map([...menubar]));
  const disposable = menubar.onDidLoad(
    lazyTask(() => {
      menubarList.value = new Map([...menubar]);
    })
  );
  onBeforeUnmount(() => disposable.dispose());

  return menubarList;
};

const useGroups = (menubar: Menubar) => {
  const groups = shallowRef(menubar.groups);
  const disposable = menubar.onDidChangeGroups(() => {
    groups.value = menubar.groups;
  });
  onBeforeUnmount(() => disposable.dispose());

  return groups;
};

export default defineComponent({
  name: 'Menubar',
  components: {
    MenuItem,
  },
  setup() {
    const menubarList = useMenubarList();
    const { menubar, commands } = useEditor();
    const groups = useGroups(menubar);
    const { has, visibleList } = useDivider(groups, menubarList);

    const executeCommand = async (key: string) => {
      const item = menubar.get(key);
      if (item?.command) await commands.execute(item.command, item);
    };

    return { menubarList, has, visibleList, executeCommand };
  },
});
</script>

<style lang="less">
.editor-menubar {
  &-wrapper {
    height: 100%;
    overflow: hidden;
    background: var(--widget-color);
    border-bottom: 1px solid var(--border-color);
  }

  &-content {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &-inner {
    display: flex;
    align-items: center;
    margin-right: auto;
    height: 100%;
    padding: 0 var(--padding-sm);
    cursor: default;
  }
}
</style>
