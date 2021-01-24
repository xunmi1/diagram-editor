<template>
  <section class="editor-menubar-wrapper">1</section>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, reactive } from 'vue';
import { useEditor } from '@/use';
import type { MenubarItem } from '@/menubar';

const useMenubarList = () => {
  const editor = useEditor();
  const menubar = editor.menubar;
  const panelList = reactive<MenubarItem>([...menubar]);
  const disposable = menubar.onDidLoad(item => {
    panelList.push(item);
  });
  onBeforeUnmount(() => disposable.dispose());

  return panelList;
};

export default defineComponent({
  name: 'Menubar',
  setup() {
    const menubarList = useMenubarList();
    console.log(menubarList);
  },
});
</script>

<style lang="less">
.editor-menubar {
  &-wrapper {
    background: var(--widget-color);
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
