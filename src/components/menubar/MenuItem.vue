<template>
  <ADropdown :align="{ offset: [0, 0] }" @visible-change="changeVisible">
    <div
      tabindex="-1"
      class="editor-menubar-item"
      :class="{ 'editor-menubar-item-hover': visible }"
      @click="!hasChild && clickMenu(menuKey)"
    >
      <span>{{ menu.text }}</span>
    </div>
    <template v-if="hasChild" #overlay>
      <Menu :list="menu.children" @click="clickMenu" />
    </template>
  </ADropdown>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, unref } from 'vue';
import { MenubarItem } from '@/menubar';
import { Menu, useMenuItem } from '@/shared';

export default defineComponent({
  name: 'MenuItem',
  components: {
    Menu,
  },
  props: {
    menu: {
      type: MenubarItem,
      required: true,
    },
    menuKey: String,
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { menuKey } = toRefs(props);
    const menu = useMenuItem(props.menu);

    const visible = ref(false);
    const hasChild = computed(() => !!unref(menu).children?.size);
    const clickMenu = (key: string) => {
      changeVisible(false);
      emit('click', key);
    };

    const changeVisible = (bool: boolean) => {
      visible.value = bool;
    };
    return { menu, menuKey, clickMenu, changeVisible, hasChild, visible };
  },
});
</script>

<style lang="less">
@menubar-item-width: 240px;

.editor-menubar-item {
  display: flex;
  padding: 0 var(--padding-sm);
  line-height: 1;
  align-items: center;
  cursor: pointer;

  &:hover,
  &-hover {
    background: var(--hover-bg);
  }
}
</style>
