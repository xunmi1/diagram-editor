<template>
  <AMenu v-show="has" @click="clickMenu" class="editor-widget-menu">
    <template v-for="[key, child] in list" :key="key">
      <SubMenu v-if="child.visible" :item="child" :key="key" />
    </template>
  </AMenu>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';
import { Menu } from '@/interfaces';
import SubMenu from './SubMenu.vue';

export default defineComponent({
  name: 'Menu',
  components: {
    SubMenu,
  },
  props: {
    list: {
      type: Map,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const has = computed(() => {
      const target = unref(props.list as Map<string, Menu>);
      if (!target?.size) return false;
      return [...target.values()].some(v => v.visible);
    });
    const clickMenu = ({ key }: { key: string | symbol }) => {
      emit('click', key);
    };
    return { clickMenu, has };
  },
});
</script>

<style lang="less">
@menu-item-width: 240px;
@control-padding-horizontal: 12px;
@menu-item-prefix: 20px;

.editor-widget-menu {
  min-width: @menu-item-width;

  &-item {
    &-inner {
      display: flex;
      justify-content: stretch;
      align-items: center;
    }

    &-text {
      padding-left: @menu-item-prefix;
    }

    &-icon {
      position: absolute;
      left: 10px;
      display: flex;
    }
  }
}

.editor {
  .editor-dropdown-menu {
    padding: 4px 0;
    background-color: var(--widget-color);

    &-submenu {
      min-width: @menu-item-width;

      &-title {
        padding-left: @menu-item-prefix + @control-padding-horizontal;
      }
    }
  }
}
</style>
