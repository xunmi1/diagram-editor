<template>
  <section class="editor-layout">
    <Sidebar class="editor-sidebar" />
    <div class="editor-graph-wrapper">
      <div ref="container" class="editor-graph"></div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, shallowReactive } from 'vue';
import Sidebar from './components/Sidebar.vue';
import { useGraph, useEditor, useGlobalGraph } from '@/use';
import { merge } from 'lodash-es';
import { GraphOptions } from '@/interfaces';

const defaultOptions: GraphOptions = {
  grid: {
    size: 10, // 网格大小 10px
    visible: true, // 绘制网格，默认绘制 dot 类型网格
  },
  snapline: {
    enabled: true,
    tolerance: 10,
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
};

export default defineComponent({
  name: 'App',
  components: {
    Sidebar,
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

.editor-sidebar {
  flex: none;
}
.editor-graph-wrapper {
  flex: auto;
}

.editor-graph {
  height: 100%;
}
</style>
