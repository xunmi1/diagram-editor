import { defineComponent, onMounted, onBeforeUnmount, ref, unref } from 'vue';

export default defineComponent({
  name: 'Container',
  props: ['view'],
  emits: ['mounted', 'unmounted'],
  setup(props, { emit }) {
    const domRef = ref<HTMLElement>();
    const view = props.view;
    onMounted(() => {
      view.mount(unref(domRef));
      emit('mounted', view);
    });
    onBeforeUnmount(() => {
      view.unmount();
      emit('unmounted', view);
    });

    return () => <div ref={domRef} />;
  },
});
