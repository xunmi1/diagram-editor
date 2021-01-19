<template>
  <section class="editor-layout">
    <Explorer class="editor-sidebar" />
    <div class="editor-graph-wrapper">
      <div ref="container" class="editor-graph"></div>
    </div>
    <Config class="editor-config" />
  </section>
</template>

<script lang="ts">
import { defineComponent, shallowReactive } from 'vue';
import { useGraph, useEditor, useGlobalGraph } from '@/use';
import { merge } from '@/utils';
import { defaultOptions } from '@/defaultOptions';
import Explorer from '@/components/Explorer.vue';
import Config from '@/components/Config.vue';

export default defineComponent({
  name: 'App',
  components: {
    Explorer,
    Config,
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

.editor-sidebar,
.editor-config {
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
