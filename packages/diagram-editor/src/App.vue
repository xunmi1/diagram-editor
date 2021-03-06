<template>
  <ConfigProvider>
    <div class="editor editor-layout">
      <div v-show="layout.menubar" class="editor-layout-menubar">
        <KeepAlive>
          <Menubar v-if="layout.menubar" class="editor-menubar" />
        </KeepAlive>
      </div>

      <div v-show="layout.toolbar" :style="toolbarStyle" class="editor-layout-toolbar">
        <KeepAlive>
          <Toolbar v-if="layout.toolbar" class="editor-toolbar" />
        </KeepAlive>
      </div>

      <Split :style="contentStyle" class="editor-content">
        <KeepAlive>
          <SplitPanel v-if="layout.explorer" key="explorer" class="editor-layout-explorer">
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
          <SplitPanel v-if="layout.controller" key="controller" class="editor-layout-controller">
            <Controller class="editor-controller" />
          </SplitPanel>
        </KeepAlive>
      </Split>

      <div v-show="layout.statusbar" class="editor-layout-statusbar">
        <KeepAlive>
          <Statusbar v-if="layout.statusbar" class="editor-statusbar" />
        </KeepAlive>
      </div>

      <KeepAlive>
        <ContextMenu v-if="layout.contextMenu" />
      </KeepAlive>
    </div>
  </ConfigProvider>
</template>

<script lang="ts">
import { defineComponent, computed, shallowRef, onBeforeUnmount, Ref, PropType } from 'vue';
import { Split, SplitPanel, lazyTask } from '@diagram-editor/shared';
import { useGraph, useEditor, useGlobalGraph } from './use';
import ConfigProvider from './components/ConfigProvider.vue';
import Menubar from './components/menubar/Menubar.vue';
import Toolbar from './components/toolbar/Toolbar.vue';
import Statusbar from './components/statusbar/Statusbar.vue';
import Explorer from './components/Explorer.vue';
import Controller from './components/Controller.vue';
import ContextMenu from './components/ContextMenu.vue';
import type { EditorOptions, DiagramEditor } from './interfaces';

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

const useLayout = (editor: DiagramEditor) => {
  const { graph, ...options }: EditorOptions = editor.options;
  const layout = shallowRef(options);
  const disposable = editor.onDidUpdate(lazyTask((v: Omit<EditorOptions, 'graph'>) => (layout.value = v)));
  onBeforeUnmount(() => disposable.dispose());
  return layout;
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
  props: {
    editor: {
      type: Object as PropType<DiagramEditor>,
      required: true,
    },
  },
  setup(props) {
    // eslint-disable-next-line
    const editor = props.editor;
    useEditor(editor);

    const container = shallowRef<HTMLElement>();
    const graph = useGraph(container, editor.options.graph);
    useGlobalGraph(graph);

    const layout = useLayout(editor);
    const { contentStyle, toolbarStyle } = useStyle(layout);

    return { container, graph, layout, toolbarStyle, contentStyle };
  },
});
</script>

<style lang="less">
@import '../../shared/dist/style.css';

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
