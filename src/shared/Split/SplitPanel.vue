<template>
  <div class="editor-split-panel" :ref="getContainer">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useInject } from '@/use';
import { INJECT_KEY } from './contants';

interface Props {
  flexible?: boolean;
}

export default defineComponent({
  name: 'SplitPanel',
  props: {
    flexible: Boolean,
  },
  setup(props) {
    const meta = useInject<Map<HTMLElement, Props>>(INJECT_KEY)!;
    const getContainer = (el: HTMLElement) => {
      meta.set(el, props);
    };

    return { getContainer };
  },
});
</script>

<style scoped>
.editor-split-panel {
  position: absolute;
  height: 100%;
}
</style>
