<template>
  <section class="editor-layout">
    <Explorer class="editor-explorer" />
    <div class="editor-graph-wrapper">
      <div ref="container" class="editor-graph"></div>
    </div>
    <Controller class="editor-controller" />
  </section>
</template>

<script lang="ts">
import { defineComponent, shallowReactive } from 'vue';
import { useGraph, useEditor, useGlobalGraph } from '@/use';
import { merge } from '@/utils';
import { defaultOptions } from '@/defaultOptions';
import Explorer from '@/components/Explorer.vue';
import Controller from '@/components/Controller.vue';

export default defineComponent({
  name: 'App',
  components: {
    Explorer,
    Controller,
  },
  props: ['options', 'editor'],
  setup(props) {
    useEditor(shallowReactive(props.editor));
    const { container, graph } = useGraph(merge(defaultOptions, props.options));
    useGlobalGraph(graph);
    return { container, graph };
  },
});
</script>

<style>
.editor-layout {
  height: 100%;
  display: flex;
  justify-content: stretch;
  overflow: hidden;
}

.editor-explorer,
.editor-controller {
  flex: none;
}

.editor-graph-wrapper {
  flex: auto;
  padding: 24px;
  background: #f0f2f5;
}

.editor-graph {
  height: 100%;
  background: #fff;
}
</style>
