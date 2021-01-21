<template>
  <ConfigProvider>
    <div class="editor editor-layout">
      <Explorer class="editor-explorer" />
      <section class="editor-container">
        <div class="editor-instance">
          <div ref="container"></div>
        </div>
      </section>
      <Controller class="editor-controller" />
    </div>
  </ConfigProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGraph, useEditor, useGlobalGraph } from '@/use';
import { merge } from '@/utils';
import { defaultOptions } from '@/defaultOptions';
import { ConfigProvider } from '@/shared';
import Explorer from '@/components/Explorer.vue';
import Controller from '@/components/Controller.vue';

export default defineComponent({
  name: 'App',
  components: {
    ConfigProvider,
    Explorer,
    Controller,
  },
  props: ['options', 'editor'],
  setup(props) {
    useEditor(props.editor);
    const { container, graph } = useGraph(merge(defaultOptions, props.options));
    useGlobalGraph(graph);
    return { container, graph };
  },
});
</script>

<style lang="less">
.editor-layout {
  height: 100%;
  display: flex;
  justify-content: stretch;
  overflow: hidden;

  .editor-explorer,
  .editor-controller {
    flex: none;
  }

  .editor-container {
    flex: auto;
    padding: var(--padding-middle);
    background: var(--layout-background);
  }
}
.editor-instance {
  display: grid;
  height: 100%;
  place-content: stretch;
  background: var(--widget-color);

  > .x6-graph-scroller,
  > .x6-graph {
    width: unset !important;
    height: unset !important;
  }
}
</style>
