<template>
  <section class="editor-sidebar-left editor-border-right">
    <h4 class="editor-widget-title editor-border-bottom">资源管理器</h4>
    <ACollapse v-model:active-key="activeKey" class="editor-collapse">
      <template v-for="[key, panel] in panelList" :key="key">
        <ACollapsePanel :panel-key="key" :header="getPanelTitle(panel)">
          <Container :view="panel" @mounted="mounted" @unmounted="unmounted" />
        </ACollapsePanel>
      </template>
    </ACollapse>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, unref } from 'vue';
import { useEditor, useGlobalGraph } from '@/use';
import { EventType } from '@/constants';
import { Addon } from '@antv/x6';
import type { CellPanel } from '@/explorer';
import Container from './Container';

const useDnd = () => {
  const dndRef = ref<Addon.Dnd>();
  useGlobalGraph(graph => {
    dndRef.value = new Addon.Dnd({
      target: graph,
      scaled: true,
      animation: true,
    });
  });
  return dndRef;
};

type PanelList = [string, CellPanel][];

const createView = (Ctor: typeof CellPanel, ...args) => {
  const view = new Ctor(...args);
  view.created?.();
  return view;
};

const usePanelList = () => {
  const editor = useEditor();
  const explorer = editor.explorer;
  const model = [...explorer].map(([key, View]) => [key, createView(View, editor)]);
  const panelList = reactive<PanelList>(model);
  explorer.on(EventType.EXPLORER_ADDED, ({ key, View }: any) => {
    panelList.push([key, createView(View, editor)]);
  });

  return panelList;
};

export default defineComponent({
  name: 'Explorer',
  components: { Container },
  setup() {
    const panelList = usePanelList();
    // 第一个 bar 的 key
    const activeKey = ref(panelList[0]?.[0]);
    const dndRef = useDnd();

    const getPanelTitle = (view: CellPanel) => {
      return view.constructor.title;
    };

    const drag = args => {
      const dnd = unref(dndRef);
      dnd?.start(args.cell, args.e);
    };

    const mounted = view => {
      view.on(EventType.EXPLORER_CELL_MOVE, drag);
    };

    const unmounted = view => {
      view.off(EventType.EXPLORER_CELL_MOVE, drag);
    };

    return { panelList, activeKey, getPanelTitle, mounted, unmounted };
  },
});
</script>

<style lang="less">
.editor-sidebar-left {
  width: 320px;
}

.editor .editor-collapse {
  border-right: none;
  border-top: none;
}
</style>
