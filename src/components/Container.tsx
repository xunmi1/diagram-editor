import { defineComponent, onMounted, onBeforeUnmount, ref, unref } from 'vue';
import { useGlobalGraph } from '@/use';
import { Lifecycle } from '@/interfaces';

const asyncGlobalGraph = () => {
  return new Promise(resolve => {
    useGlobalGraph(graph => resolve(graph));
  });
};

export default defineComponent({
  name: 'Container',
  props: ['view'],
  emits: ['mounted', 'unmounted'],
  async setup(props, { emit }) {
    const domRef = ref<HTMLElement>();
    const view = props.view as Lifecycle;

    onMounted(async () => {
      await view.mount(unref(domRef)!);
      emit('mounted', view);
      await view.mounted?.();
    });

    onBeforeUnmount(async () => {
      await view.beforeUnmount?.();
      emit('unmounted', view);
      await view.unmount(unref(domRef)!);
      domRef.value = undefined;
    });

    await asyncGlobalGraph();

    return () => <div ref={domRef} />;
  },
});
