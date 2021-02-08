<template>
  <ASubMenu v-if="hasChild" :title="menuItem.text" :disabled="menuItem.disabled" :popup-offset="[-6, -4]">
    <template v-for="key in visibleList" :key="key">
      <SubMenu v-if="true" :key="key" :item="getChild(key)" />
      <AMenuDivider v-if="has(key)" :key="key" />
    </template>
  </ASubMenu>
  <AMenuItem v-else :title="menuItem.text" :disabled="menuItem.disabled">
    <div class="editor-widget-menu-item-inner">
      <span v-show="menuItem.checked" v-html="checkSVG" class="editor-widget-menu-item-icon" />
      <span class="editor-widget-menu-item-text">{{ menuItem.text }}</span>
      <span v-if="menuItem.extra" class="editor-widget-menu-item-extra">{{ menuItem.extra }}</span>
    </div>
  </AMenuItem>
</template>

<script lang="ts">
import { ref, computed, defineComponent, PropType } from 'vue';
import { Check } from '@icon-park/svg';
import { stringifySVG } from '@diagram-editor/shared';
import { MenuItem } from '@/menu';
import { useMenuItem, useDivider } from './use';

const checkSVG = stringifySVG(Check);

export default defineComponent({
  name: 'SubMenu',
  props: {
    item: {
      type: Object as PropType<MenuItem>,
      required: true,
    },
  },
  emits: ['changeVisible'],
  setup(props) {
    const menuItem = useMenuItem(props.item as MenuItem);
    const groups = ref(menuItem.value.groups);
    const children = computed(() => menuItem.value.children);

    menuItem.value.onDidChangeGroups(() => {
      groups.value = menuItem.value.groups;
    });

    const { has, visibleList } = useDivider(groups, children);

    const hasChild = computed(() => menuItem.value.children?.size);

    const getChild = (key: string) => menuItem.value.children!.get(key);

    return { menuItem, hasChild, checkSVG, groups, getChild, has, visibleList };
  },
});
</script>
