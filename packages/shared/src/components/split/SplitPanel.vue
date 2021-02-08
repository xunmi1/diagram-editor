<template>
  <div class="editor-split-panel" ref="container">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, onMounted, onActivated, onDeactivated, inject } from 'vue';
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
    const meta = inject<Map<HTMLElement, Props>>(INJECT_KEY)!;
    const container = ref<HTMLElement>();

    onMounted(() => {
      const el = unref(container)!;
      meta.set(el, props);
    });

    onActivated(() => {
      meta.set(unref(container)!, props);
    });

    onDeactivated(() => {
      meta.delete(unref(container)!);
    });

    return { container };
  },
});
</script>

<style>
.editor-split-panel {
  position: absolute;
  height: 100%;
}
</style>
