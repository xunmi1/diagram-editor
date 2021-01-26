<template>
  <ADropdown :align="{ offset: [0, 0] }" @visible-change="changeVisible">
    <div
      tabindex="-1"
      class="editor-menubar-item"
      :class="{ 'editor-menubar-item-hover': visible }"
      @click="!hasChild && clickMenu({ key: menuKey })"
    >
      <span>{{ menu.title }}</span>
    </div>
    <template v-if="hasChild" #overlay>
      <AMenu @click="clickMenu" class="editor-menubar-dropdown">
        <template v-for="[key, child] in menu.children" :key="key">
          <MenuSubItem :item="child" />
        </template>
      </AMenu>
    </template>
  </ADropdown>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, unref } from 'vue';
import { MenubarItem } from '@/menubar';
import MenuSubItem from './MenuSubItem.vue';
import { useMenuItem } from './use';

export default defineComponent({
  name: 'MenuItem',
  components: {
    MenuSubItem,
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
    const clickMenu = ({ key }: { key: string }) => {
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

.editor-menubar {
  &-item {
    display: flex;
    padding: 0 var(--padding-middle);
    height: 100%;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover,
    &-hover {
      background: var(--hover-background);
    }
  }

  &-dropdown {
    min-width: @menubar-item-width;
  }
}

.editor {
  .editor-dropdown-menu {
    padding: 4px 0;
    background-color: var(--widget-color);

    &-submenu {
      min-width: @menubar-item-width;
    }
  }
}
</style>
