<template>
  <section class="editor-sidebar-right editor-border-left">
    <h4 class="editor-widget-title editor-border-bottom">属性配置</h4>
    <ATabs v-if="tabList.length" class="editor-tabs">
      <template v-for="[key, panel] in tabList" :key="key">
        <ATabPane :tab="getPanelTitle(panel)">
          <Container :view="panel" />
        </ATabPane>
      </template>
    </ATabs>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, unref } from 'vue';
import type { Cell } from '@antv/x6';
import { useGlobalGraph, useEditor } from '@/use';
import { EventType } from '@/constants';
import { ConfigPanel } from '@/controller';
import Container from './Container';

const CELL_TRIGGER_TYPE = 'cell:click';
const CELL_CANCEL_TYPE = 'blank:click';

type PanelList = [string, ConfigPanel][];

const createView = (Ctor: typeof ConfigPanel, ...args) => {
  const view = new Ctor(...args);
  view.created?.();
  return view;
};

const usePanelList = () => {
  const editor = useEditor();
  const controller = editor.controller;
  const model = [...controller].map(([key, View]) => [key, createView(View, editor)]);
  const panelList = reactive<PanelList>(model);
  controller.on(EventType.CONTROLLER_ADDED, ({ key, View }: any) => {
    panelList.push([key, createView(View, editor)]);
  });

  return panelList;
};

export default defineComponent({
  name: 'Controller',
  components: { Container },
  setup() {
    const panelList = usePanelList();
    const activeCell = ref<Cell>(null);

    useGlobalGraph(graph => {
      graph.on(CELL_TRIGGER_TYPE, ({ cell }) => {
        activeCell.value = cell;
      });
      graph.on(CELL_CANCEL_TYPE, () => {
        activeCell.value = null;
      });
    });

    const getPanelTitle = (view: ConfigPanel) => {
      return view.constructor.title;
    };
    // 基于不同启动条件，确定配置面板
    const tabList = computed(() => panelList.filter(([_, v]) => v.activate(unref(activeCell))));
    return { tabList, getPanelTitle };
  },
});
</script>

<style lang="less">
.editor-sidebar-right {
  display: flex;
  flex-direction: column;
  width: 360px;
}

.editor-tabs {
  flex: auto;
}
</style>
