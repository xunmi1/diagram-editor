<template>
  <AMenu v-show="show" class="editor-widget-menu" @click="clickMenu">
    <template v-for="key in visibleList" :key="key">
      <!-- use `v-if` to avoid vue compiler error about `key` -->
      <SubMenu v-if="true" :key="key" :item="getChild(key)" />
      <AMenuDivider v-if="has(key)" :key="key" />
    </template>
  </AMenu>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, PropType } from 'vue';
import type { MenuItem } from '../../menu';
import SubMenu from './SubMenu.vue';
import { useDivider } from './use';

export default defineComponent({
  name: 'Menu',
  components: {
    SubMenu,
  },
  props: {
    list: {
      type: Map as PropType<Map<string, MenuItem>>,
      required: true,
    },
    groups: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { groups, list: children } = toRefs(props);

    const show = computed(() => {
      if (!children.value?.size) return false;
      return [...children.value.values()].some(v => v.visible);
    });

    const clickMenu = ({ key }: { key: string }) => {
      emit('click', key);
    };

    const getChild = (key: string) => children.value.get(key) as MenuItem;
    const { has, visibleList } = useDivider(groups, children);
    return { clickMenu, show, getChild, has, visibleList };
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

    &-extra {
      margin-left: auto;
      filter: opacity(0.75);
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
