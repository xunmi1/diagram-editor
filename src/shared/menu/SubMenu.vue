<template>
  <ASubMenu v-if="hasChild" :title="item.text" :disabled="item.disabled" :popup-offset="[-4, -4]">
    <template v-for="[key, child] in item.children" :key="key">
      <SubMenu v-if="child.visible" :item="child" :key="key" />
    </template>
  </ASubMenu>
  <AMenuItem v-else :title="item.text" :disabled="item.disabled">
    <div class="editor-widget-menu-item-inner">
      <span v-show="item.checked" v-html="checkSVG" class="editor-widget-menu-item-icon" />
      <span class="editor-widget-menu-item-text">{{ item.text }}</span>
    </div>
  </AMenuItem>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';
import { Check } from '@icon-park/svg';
import { stringifySVG } from '@/utils';
import { Menu } from '@/interfaces';
import { useMenuItem } from './use';

const checkSVG = stringifySVG(Check);

export default defineComponent({
  name: 'SubMenu',
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const item = useMenuItem(props.item as Menu);
    const hasChild = computed(() => {
      const target = unref(item).children;
      if (!target?.size) return false;
      return [...target.values()].some(v => v.visible);
    });
    return { item, hasChild, checkSVG };
  },
});
</script>
