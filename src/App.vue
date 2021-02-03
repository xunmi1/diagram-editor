<template>
  <ConfigProvider>
    <div class="editor editor-layout">
      <div v-show="editorOptions.menubar" class="editor-layout-menubar">
        <KeepAlive>
          <Menubar v-if="editorOptions.menubar" class="editor-menubar" />
        </KeepAlive>
      </div>

      <div v-show="editorOptions.toolbar" :style="toolbarStyle" class="editor-layout-toolbar">
        <KeepAlive>
          <Toolbar v-if="editorOptions.toolbar" class="editor-toolbar" />
        </KeepAlive>
      </div>

      <Split :style="contentStyle" class="editor-content">
        <KeepAlive>
          <SplitPanel v-if="editorOptions.explorer" key="explorer" class="editor-layout-explorer">
            <Explorer class="editor-explorer" />
          </SplitPanel>
        </KeepAlive>

        <SplitPanel key="editor" class="editor-layout-graph" flexible>
          <section class="editor-container">
            <div class="editor-instance">
              <div ref="container" class="editor-graph"></div>
            </div>
          </section>
        </SplitPanel>

        <KeepAlive>
          <SplitPanel v-if="editorOptions.controller" key="controller" class="editor-layout-controller">
            <Controller class="editor-controller" />
          </SplitPanel>
        </KeepAlive>
      </Split>

      <div v-show="editorOptions.statusbar" class="editor-layout-statusbar">
        <KeepAlive>
          <Statusbar v-if="editorOptions.statusbar" class="editor-statusbar" />
        </KeepAlive>
      </div>

      <KeepAlive>
        <ContextMenu v-if="editorOptions.contextMenu" />
      </KeepAlive>
    </div>
  </ConfigProvider>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue';
import { useGraph, useEditor, useGlobalGraph } from '@/use';
import { ConfigProvider, Split, SplitPanel } from '@/shared';
import Menubar from '@/components/menubar/Menubar.vue';
import Toolbar from '@/components/toolbar/Toolbar.vue';
import Statusbar from '@/components/statusbar/Statusbar.vue';
import Explorer from '@/components/Explorer.vue';
import Controller from '@/components/Controller.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import { EditorOptions } from '@/interfaces';

const useStyle = (options: Ref<EditorOptions>) => {
  const contentStyle = computed(() => {
    const style = { top: '0', bottom: '0' };
    const { menubar, toolbar, statusbar } = options.value;
    if (menubar) style.top = `var(--menubar-height)`;
    if (toolbar) style.top = `var(--toolbar-height)`;
    if (menubar && toolbar) style.top = `calc(var(--menubar-height) + var(--toolbar-height))`;
    if (statusbar) style.bottom = `var(--statusbar-height)`;
    return style;
  });

  const toolbarStyle = computed(() => {
    return { top: options.value.menubar ? `var(--menubar-height)` : '0' };
  });

  return { contentStyle, toolbarStyle };
};

export default defineComponent({
  name: 'App',
  components: {
    Split,
    SplitPanel,
    ConfigProvider,
    Menubar,
    Toolbar,
    Explorer,
    Controller,
    Statusbar,
    ContextMenu,
  },
  props: ['options', 'editor'],
  setup(props) {
    useEditor(props.editor);
    const container = ref<HTMLElement>();
    const { graph: graphOptions, ...options } = props.options;
    const editorOptions = ref<Omit<EditorOptions, 'graph'>>(options);
    const graph = useGraph(container, graphOptions);
    const { contentStyle, toolbarStyle } = useStyle(editorOptions);
    useGlobalGraph(graph);

    return { container, graph, editorOptions, toolbarStyle, contentStyle };
  },
});
</script>

<style lang="less">
.editor-layout {
  position: relative;
  height: 100%;

  .editor-content {
    position: absolute;
    width: 100%;
  }

  &-menubar {
    position: absolute;
    top: 0;
    width: 100%;
    height: var(--menubar-height);
  }

  &-toolbar {
    position: absolute;
    width: 100%;
    height: var(--toolbar-height);
  }

  &-statusbar {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: var(--statusbar-height);
  }

  &-explorer {
    width: var(--explorer-width);
    left: 0;
    overflow: auto;
  }

  &-controller {
    width: var(--controller-width);
    right: 0;
    overflow: auto;
  }

  &-graph {
    overflow: hidden;
    width: calc(100% - var(--explorer-width) - var(--controller-width));
  }
}

.editor-container {
  height: 100%;
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
