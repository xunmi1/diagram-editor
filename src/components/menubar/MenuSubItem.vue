<template>
  <ASubMenu v-if="hasChild" :title="item.text" :disabled="item.disabled" :popup-offset="[-4, -4]">
    <template v-for="[key, child] in item.children" :key="key">
      <MenuSubItem :item="child" />
    </template>
  </ASubMenu>
  <AMenuItem v-else :title="item.text" :disabled="item.disabled">
    <div class="editor-menubar-item-inner">
      <span v-if="item.checked" v-html="checkSVG" class="editor-menubar-item-icon" />
      <span class="editor-menubar-item-text">{{ item.text }}</span>
    </div>
  </AMenuItem>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';
import { Check } from '@icon-park/svg';
import { stringifySVG } from '@/utils';
import { MenubarItem } from '@/menubar';
import { useMenuItem } from './use';

const checkSVG = stringifySVG(Check);

export default defineComponent({
  name: 'MenuSubItem',
  props: {
    item: {
      type: MenubarItem,
      required: true,
    },
  },
  setup(props) {
    const item = useMenuItem(props.item);
    const hasChild = computed(() => !!unref(item).children?.size);
    return { item, hasChild, checkSVG };
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

  &-text {
    padding-left: @menu-item-prefix;
  }

  &-icon {
    position: absolute;
    left: 10px;
    display: flex;
  }
}
.editor {
  .editor-dropdown-menu-submenu-title {
    padding-left: @menu-item-prefix + @control-padding-horizontal;
  }
}
</style>
