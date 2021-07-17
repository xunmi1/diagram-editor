<template>
  <ATooltip :title="statusItem.tooltip" :align="{ offset: [0, 2] }" :mouse-enter-delay="0.6">
    <div
      v-show="statusItem.visible"
      tabindex="-1"
      class="editor-statusbar-item"
      :class="{ 'editor-pointer': !!statusItem.command }"
      @click="trigger"
    >
      <span v-show="statusItem.icon" class="editor-statusbar-item-icon" v-html="statusItem.icon"></span>
      <span>{{ statusItem.text }}</span>
    </div>
  </ATooltip>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { StatusbarItem } from '../statusbar';
import { useStatusItem } from './use';

export default defineComponent({
  name: 'StatusItem',
  props: {
    item: {
      type: Object as PropType<StatusbarItem>,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const statusItem = useStatusItem(props.item);
    const trigger = () => emit('click', props.item);

    return { statusItem, trigger };
  },
});
</script>

<style lang="less">
.editor-statusbar-item {
  display: flex;
  padding: 0 var(--padding-xs);
  align-items: center;
  line-height: 1;
  height: 100%;

  &:hover {
    background: var(--hover-bg);
  }

  &-icon {
    margin-right: 4px;
    max-height: 100%;
    display: flex;
    overflow: hidden;
    object-fit: contain;
  }
}
</style>
