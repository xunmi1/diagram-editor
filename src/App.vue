<template>
  <ConfigProvider>
    <div class="editor editor-layout">
      <Toolbar class="editor-toolbar" />
      <Split class="editor-content">
        <SplitPanel key="explorer" class="editor-layout-left">
          <Explorer class="editor-explorer" />
        </SplitPanel>
        <SplitPanel key="editor" class="editor-layout-middle" flexible>
          <section class="editor-container">
            <div class="editor-instance">
              <div ref="container"></div>
            </div>
          </section>
        </SplitPanel>
        <SplitPanel key="controller" class="editor-layout-right">
          <Controller class="editor-controller" />
        </SplitPanel>
      </Split>
    </div>
  </ConfigProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGraph, useEditor, useGlobalGraph } from '@/use';
import { merge } from '@/utils';
import { defaultOptions } from '@/defaultOptions';
import { ConfigProvider, Split, SplitPanel } from '@/shared';
import Toolbar from '@/components/Toolbar.vue';
import Explorer from '@/components/Explorer.vue';
import Controller from '@/components/Controller.vue';

export default defineComponent({
  name: 'App',
  components: {
    Split,
    SplitPanel,
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
  height: 100%;

  .editor-toolbar {
    position: absolute;
    top: 0;
    height: var(--toolbar-height);
    width: 100%;
  }

  .editor-content {
    position: absolute;
    top: var(--toolbar-height);
    bottom: var(--statusbar-height);
    width: 100%;
  }

  &-left {
    width: 320px;
    left: 0;
    overflow: auto;
  }
  &-right {
    width: 320px;
    right: 0;
    overflow: auto;
  }

  &-middle {
    overflow: hidden;
  }
}

.editor-container {
  height: 100%;
  background: var(--layout-background);
}

.editor-instance {
  display: grid;
  height: 100%;
  place-content: stretch;
  background: #fff;

  > .x6-graph-scroller,
  > .x6-graph {
    width: unset !important;
    height: unset !important;
  }
}
</style>
