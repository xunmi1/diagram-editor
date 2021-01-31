import { defineComponent, shallowRef, unref, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
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
  emits: ['will-mount', 'did-mount', 'will-unmount', 'did-unmount'],
  async setup(props, { emit }) {
    const domRef = shallowRef<HTMLElement>();
    const view = props.view as Lifecycle;

    onBeforeMount(() => emit('will-mount', view));

    onMounted(async () => {
      await view.mount(unref(domRef)!);
      emit('did-mount', view);
    });

    onBeforeUnmount(async () => {
      emit('will-unmount', view);
      await view.unmount(unref(domRef)!);
      domRef.value = undefined;
    });

    onUnmounted(() => emit('did-unmount', view));

    await asyncGlobalGraph();

    return () => <div ref={domRef} />;
  },
});
