<template>
  <ATooltip :title="item.tooltip" :align="{ offset: [0, 2] }" :mouse-enter-delay="0.6">
    <div
      v-show="item.visible"
      tabindex="-1"
      class="editor-statusbar-item"
      :class="{ 'editor-pointer': !!item.command }"
      @click="trigger"
    >
      <span>{{ item.text }}</span>
    </div>
  </ATooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { StatusbarItem } from '@/statusbar';
import { useStatusItem } from './use';

export default defineComponent({
  name: 'StatusItem',
  props: {
    item: {
      type: StatusbarItem,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const item = useStatusItem(props.item);
    const trigger = () => emit('click', props.item);

    return { item, trigger };
  },
});
</script>

<style lang="less">
.editor-statusbar {
  &-item {
    display: flex;
    padding: 0 var(--padding-xs);
    align-items: center;
    line-height: 1;

    &:hover {
      background: var(--hover-bg);
    }
  }
}
</style>
