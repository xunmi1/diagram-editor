<template>
  <section class="editor-menubar-wrapper">
    <div class="editor-menubar-content">
      <div class="editor-menubar-inner">
        <template v-for="[key, menu] in menubarList" :key="key">
          <MenuItem :menu="menu" :menu-key="key" @click="executeCommand" />
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import { useEditor } from '@/use';
import type { MenubarItem } from '@/menubar';
import MenuItem from './MenuItem.vue';

type MenubarList = Map<string, MenubarItem>;

const useMenubarList = () => {
  const { menubar } = useEditor();
  const menubarList = ref<MenubarList>(new Map([...menubar]));
  const disposable = menubar.onDidLoad(() => {
    menubarList.value = new Map([...menubar]);
  });

  onBeforeUnmount(() => disposable.dispose());

  return menubarList;
};

export default defineComponent({
  name: 'Menubar',
  components: {
    MenuItem,
  },
  setup() {
    const menubarList = useMenubarList();
    const { menubar, commands } = useEditor();

    const executeCommand = async (key: string) => {
      const item = menubar.get(key);
      if (item?.command) await commands.execute(item.command, item);
    };

    return { menubarList, executeCommand };
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
    align-items: stretch;
    margin-right: auto;
    height: 100%;
    padding: 0 var(--padding-sm);
    cursor: default;
  }
}
</style>
