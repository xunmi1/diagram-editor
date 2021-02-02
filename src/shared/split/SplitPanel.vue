<template>
  <div class="editor-split-panel" ref="container" :style="{}">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, onMounted } from 'vue';
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
    const container = ref<HTMLElement>();

    onMounted(() => {
      const el = unref(container)!;
      meta.set(el, props);
    });

    return { container };
  },
});
</script>

<style scoped>
.editor-split-panel {
  position: absolute;
  height: 100%;
}
</style>
