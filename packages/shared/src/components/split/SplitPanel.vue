<template>
  <div ref="container" class="editor-split-panel">
    <slot />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  unref,
  shallowRef,
  onMounted,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
  inject,
} from 'vue';
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
    const container = shallowRef<HTMLElement>();

    const update = () => {
      const el = unref(container);
      if (el) meta.set(el, props);
    };

    const remove = () => {
      const el = unref(container);
      if (el) meta.delete(el);
    };

    onMounted(update);
    onActivated(update);
    onDeactivated(remove);
    onBeforeUnmount(remove);

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
