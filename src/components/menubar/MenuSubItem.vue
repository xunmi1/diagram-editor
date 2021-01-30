<template>
  <ASubMenu v-if="hasChild" :title="item.title" :disabled="item.disabled" :popup-offset="[-4, -4]">
    <template v-for="[key, child] in item.children" :key="key">
      <MenuSubItem :item="child" />
    </template>
  </ASubMenu>
  <AMenuItem v-else :title="item.title" :disabled="item.disabled">
    <div class="editor-menubar-item-inner">
      <CheckOutlined v-if="item.checked" class="editor-menubar-item-icon-prefix" />
      <span class="editor-menubar-item-title">{{ item.title }}</span>
    </div>
  </AMenuItem>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';
import { CheckOutlined } from '@ant-design/icons-vue';
import { MenubarItem } from '@/menubar';
import { useMenuItem } from './use';

export default defineComponent({
  name: 'MenuSubItem',
  components: { CheckOutlined },
  props: {
    item: {
      type: MenubarItem,
      required: true,
    },
  },
  setup(props) {
    //const { item } = toRefs(props);
    const item = useMenuItem(props.item);
    const hasChild = computed(() => !!unref(item).children?.size);
    return { item, hasChild };
  },
});
</script>

<style lang="less">
@control-padding-horizontal: 12px;
@menu-item-prefix: 20px;

.editor-menubar-item {
  &-inner {
    display: flex;
    justify-content: stretch;
    align-items: center;
  }

  &-title {
    padding-left: @menu-item-prefix;
  }

  &-icon-prefix {
    position: absolute;
  }
}
.editor {
  .editor-dropdown-menu-submenu-title {
    padding-left: @menu-item-prefix + @control-padding-horizontal;
  }
}
</style>
