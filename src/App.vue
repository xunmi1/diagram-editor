<template>
  <ConfigProvider>
    <div class="editor editor-layout">
      <Toolbar class="editor-toolbar" />
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
import Toolbar from '@/components/Toolbar.vue';
import Explorer from '@/components/Explorer.vue';
import Controller from '@/components/Controller.vue';

export default defineComponent({
  name: 'App',
  components: {
    ConfigProvider,
    Toolbar,
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
  display: grid;
  place-content: stretch;
  height: 100%;
  grid-template: 32px minmax(auto, 1fr) / 300px minmax(auto, 1fr) 320px;
  grid-template-areas:
    'toolbar toolbar toolbar'
    'explorer editor controller';

  .editor-toolbar {
    grid-area: toolbar;
  }
  .editor-explorer {
    grid-area: explorer;
  }
  .editor-controller {
    grid-area: controller;
  }

  .editor-container {
    grid-area: editor;
    overflow: hidden;
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
