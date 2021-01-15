import { ref, unref, Ref, WatchEffect, watchEffect, watch, WatchOptionsBase } from 'vue';
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

export const useGraph = (options: GraphOptions, effect?: (graph: Graph) => void) => {
  const container = ref<HTMLElement>();
  const graph = ref<Graph>();

  const cb = () => {
    if (!container.value) return;
    graph.value = new Graph({
      container: container.value,
      ...options,
    });
    effect?.(unref(graph)!);
  };

  watchEffect(cb, { flush: 'post' });

  return { container, graph };
};

export const useWatchGraph = (source: Ref<Graph | undefined>, effect: (graph: Graph) => void) => {
  watch(source, graph => graph && effect(graph), { flush: 'post' });
};
