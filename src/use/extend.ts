import {
  ref,
  shallowRef,
  unref,
  Ref,
  WatchEffect,
  watchEffect,
  watch,
  onMounted,
  onBeforeUnmount,
  WatchOptionsBase,
} from 'vue';
import { Graph } from '@antv/x6';

export type OnceEffect = (...args: Parameters<WatchEffect>) => boolean;

export const useOnceWatch = (effect: OnceEffect, options?: WatchOptionsBase) => {
  const isStopRef = ref(false);
  const stop = watchEffect((...args) => {
    if (isStopRef.value) return;
    isStopRef.value = effect(...args);
  }, options);
  watchEffect(() => isStopRef.value && stop());
};

type GraphOptions = ConstructorParameters<typeof Graph>[0];

export const useGraph = (container: Ref<HTMLElement | undefined>, options?: GraphOptions) => {
  const graph = shallowRef<Graph>();
  onMounted(() => {
    const el = unref(container)!;
    graph.value = new Graph({
      container: el,
      ...options,
    });
  });

  onBeforeUnmount(() => {
    graph.value?.dispose();
    graph.value = undefined;
  });

  return graph;
};

export const useWatchGraph = (source: Ref<Graph | undefined>, effect: (graph: Graph) => void) => {
  watch(source, graph => graph && effect(graph), { flush: 'post' });
};
