<template>
  <ConfigProvider>
    <div class="editor editor-layout">
      <div class="editor-layout-top">
        <Menubar class="editor-menubar" />
      </div>
      <Split class="editor-content">
        <SplitPanel key="explorer" class="editor-layout-left">
          <Explorer class="editor-explorer" />
        </SplitPanel>
        <SplitPanel key="editor" class="editor-layout-middle" flexible>
          <section class="editor-container">
            <div class="editor-instance">
              <div ref="container" class="editor-graph"></div>
            </div>
          </section>
        </SplitPanel>
        <SplitPanel key="controller" class="editor-layout-right">
          <Controller class="editor-controller" />
        </SplitPanel>
      </Split>
      <div class="editor-layout-bottom">
        <Statusbar class="editor-statusbar" />
      </div>
    </div>
  </ConfigProvider>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useGraph, useEditor, useGlobalGraph } from '@/use';
import { merge } from '@/utils';
import { defaultOptions } from '@/defaultOptions';
import { ConfigProvider, Split, SplitPanel } from '@/shared';
import Menubar from '@/components/menubar/Menubar.vue';
import Statusbar from '@/components/statusbar/Statusbar.vue';
import Explorer from '@/components/Explorer.vue';
import Controller from '@/components/Controller.vue';

export default defineComponent({
  name: 'App',
  components: {
    Split,
    SplitPanel,
    ConfigProvider,
    Menubar,
    Explorer,
    Controller,
    Statusbar,
  },
  props: ['options', 'editor'],
  setup(props) {
    useEditor(props.editor);
    const container = ref<HTMLElement>();
    const graph = useGraph(container, merge(defaultOptions, props.options));
    useGlobalGraph(graph);
    return { container, graph };
  },
});
</script>

<style lang="less">
.editor-layout {
  height: 100%;

  .editor-content {
    position: absolute;
    top: var(--menubar-height);
    bottom: var(--statusbar-height);
    width: 100%;
  }

  &-top {
    position: absolute;
    top: 0;
    width: 100%;
    height: var(--menubar-height);
  }

  &-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: var(--statusbar-height);
  }

  &-left {
    width: var(--explorer-width);
    left: 0;
    overflow: auto;
  }

  &-right {
    width: var(--controller-width);
    right: 0;
    overflow: auto;
  }

  &-middle {
    overflow: hidden;
    width: calc(100% - var(--explorer-width) - var(--controller-width));
  }
}

.editor-container {
  height: 100%;
  background: var(--layout-bg);
}

.editor-instance {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;

  .editor-graph {
    flex: auto;
  }

  > .x6-graph-scroller {
    min-width: 100%;
    min-height: 100%;
  }
}
</style>
