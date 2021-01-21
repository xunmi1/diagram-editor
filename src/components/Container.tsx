import { defineComponent, onMounted, onBeforeUnmount, ref, unref } from 'vue';
import { Lifecycle } from '@/interfaces';

export default defineComponent({
  name: 'Container',
  props: ['view'],
  emits: ['mounted', 'unmounted'],
  setup(props, { emit }) {
    const domRef = ref<HTMLElement>();
    const view = props.view as Lifecycle;

    onMounted(() => {
      view.mount(unref(domRef)!);
      emit('mounted', view);
      view.mounted?.();
    });

    onBeforeUnmount(() => {
      view.beforeUnmount?.();
      view.unmount(unref(domRef)!);
      emit('unmounted', view);
    });

    return () => <div ref={domRef} />;
  },
});
