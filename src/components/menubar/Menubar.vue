<template>
  <section class="editor-menubar-wrapper">
    <div class="editor-menubar-content">
      <div class="editor-menubar-inner">
        <template v-for="[key, menu] in menubarList" :key="key">
          <MenuItem :menu="menu" :menu-key="key" @click="clickMenu" />
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

    const clickMenu = async (key: string) => {
      const item = menubar.get(key);
      if (item?.command) await commands.execute(item.command, item);
    };

    return { menubarList, clickMenu };
  },
});
</script>

<style lang="less">
.editor-menubar {
  &-wrapper {
    background: var(--widget-color);
    border-bottom: 1px solid var(--border-color);
  }

  &-content {
    display: flex;
    flex: auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    height: 100%;
  }

  &-inner {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 100%;
  }
}
</style>
