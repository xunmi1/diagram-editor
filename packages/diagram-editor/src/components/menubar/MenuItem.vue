<template>
  <ADropdown :align="{ offset: [0, 0] }" @visible-change="changeVisible">
    <div
      tabindex="-1"
      class="editor-menubar-item"
      :class="{ 'editor-menubar-item-hover': visible }"
      @click="!hasChild && clickMenu(itemKey)"
    >
      <span>{{ menu.text }}</span>
    </div>
    <template v-if="hasChild" #overlay>
      <Menu :list="menu.children" :groups="groups" @click="clickMenu" />
    </template>
  </ADropdown>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, shallowRef, unref } from 'vue';
import type { MenubarItem } from '@/menubar';
import { Menu, useMenuItem } from '@/shared';

export default defineComponent({
  name: 'MenuItem',
  components: {
    Menu,
  },
  props: {
    item: {
      type: Object as PropType<MenubarItem>,
      required: true,
    },
    itemKey: {
      type: String,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const menu = useMenuItem(props.item);
    const groups = shallowRef(menu.value.groups);

    unref(menu).onDidChangeGroups(() => {
      groups.value = menu.value.groups;
    });

    const visible = ref(false);
    const hasChild = computed(() => !!unref(menu).children?.size);
    const clickMenu = (key: string) => {
      changeVisible(false);
      emit('click', key);
    };

    const changeVisible = (bool: boolean) => {
      visible.value = bool;
    };
    return { menu, clickMenu, changeVisible, hasChild, visible, groups };
  },
});
</script>

<style lang="less">
@menubar-item-width: 240px;

.editor-menubar-item {
  display: flex;
  padding: 0 var(--padding-sm);
  line-height: 1;
  height: 100%;
  align-items: center;
  cursor: pointer;

  &:hover,
  &-hover {
    background: var(--hover-bg);
  }
}
</style>
