import { inject, provide, isRef, unref, InjectionKey, Ref } from 'vue';
import { Graph } from '@antv/x6';
import { isFunction } from '@/utils';
import { useOnceWatch } from '@/use';
import type DiagramEditor from '@/main';

export const useInject = <T>(key: InjectionKey<T> | string, value?: T) => {
  if (value) provide(key, value);
  return value ?? inject<T>(key);
};

const INJECT_EDITOR = Symbol('editor');
const INJECT_GRAPH = Symbol('graph');

export const useEditor = (value?: DiagramEditor) => useInject(INJECT_EDITOR, value)!;

export const useGlobalGraph = (valueOrEffect?: Ref<Graph | undefined> | ((graph: Graph) => void)) => {
  if (isRef(valueOrEffect)) {
    return useInject(INJECT_GRAPH, valueOrEffect)!;
  }

  const graphRef = useInject<Ref<Graph | undefined>>(INJECT_GRAPH)!;

  if (isFunction(valueOrEffect)) {
    useOnceWatch(() => {
      const graph = unref(graphRef);
      if (graph) valueOrEffect(graph);
      return !!graph;
    });
  }

  return graphRef;
};
