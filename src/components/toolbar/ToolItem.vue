<template>
  <ATooltip :title="item.tooltip" :align="{ offset: [0, 2] }" :mouse-enter-delay="0.6">
    <div
      tabindex="-1"
      class="editor-toolbar-item editor-pointer"
      :class="{
        'editor-toolbar-item-checked': item.checked,
        'editor-toolbar-item-disabled': item.disabled,
      }"
      @click="trigger"
    >
      <span v-html="item.icon" class="editor-toolbar-item-icon"></span>
    </div>
  </ATooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ToolbarItem } from '@/toolbar';
import { useToolItem } from './use';

export default defineComponent({
  name: 'ToolItem',
  props: {
    item: {
      type: ToolbarItem,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const item = useToolItem(props.item);
    const trigger = () => {
      if (item.value.disabled) return;
      emit('click', props.item);
    };

    return { item, trigger };
  },
});
</script>

<style lang="less">
.editor-toolbar-item {
  display: flex;
  padding: 0 var(--padding-sm);
  align-items: center;
  line-height: 1;

  &-checked:not(&-disabled),
  &:hover {
    background: var(--hover-bg);
  }

  &-disabled {
    color: var(--disabled-color);
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
      cursor: not-allowed;
    }
  }

  &-icon {
    max-height: 100%;
    display: flex;
    overflow: hidden;
    object-fit: contain;
  }
}
</style>
