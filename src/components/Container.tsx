import {
  defineComponent,
  shallowRef,
  unref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  PropType,
} from 'vue';
import { useGlobalGraph, useEditor } from '@/use';
import { Lifecycle } from '@/interfaces';

const asyncGlobalGraph = () => {
  return new Promise(resolve => {
    useGlobalGraph(graph => resolve(graph));
  });
};

export default defineComponent({
  name: 'Container',
  props: {
    view: {
      type: Object as PropType<Lifecycle>,
      required: true,
    },
  },
  emits: ['will-mount', 'did-mount', 'will-unmount', 'did-unmount'],
  async setup(props, { emit }) {
    const editor = useEditor();
    const domRef = shallowRef<HTMLElement>();
    const view = props.view as Lifecycle;

    onBeforeMount(() => emit('will-mount', view));

    onMounted(async () => {
      await view.mount(unref(domRef)!, editor);
      emit('did-mount', view);
    });

    onBeforeUnmount(async () => {
      emit('will-unmount', view);
      await view.unmount(unref(domRef)!, editor);
      domRef.value = undefined;
    });

    onUnmounted(() => emit('did-unmount', view));

    await asyncGlobalGraph();

    return () => <div ref={domRef} />;
  },
});
