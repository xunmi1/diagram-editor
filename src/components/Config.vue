<template>
  <section class="editor-config">
    <ATabs>
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
import { useGlobalGraph, useEditor } from '@/use';
import { ConfigBarView } from '@/config';
import type { Cell } from '@antv/x6';
import Container from './Container';
import { EventType } from '@/constants';

const CELL_TRIGGER_TYPE = 'cell:click';
const CELL_CANCEL_TYPE = 'blank:click';

type PanelList = [string, ConfigBarView][];

const usePanelList = () => {
  const editor = useEditor();
  const configBarModel = editor.configBarModel;
  const model = [...configBarModel].map(([key, View]) => [key, new View(editor)]);
  const panelList = reactive<PanelList>(model);
  configBarModel.on(EventType.CONFIG_BAR_VIEW_ADDED, ({ key, View }: any) => {
    panelList.push([key, new View(editor)]);
  });

  return panelList;
};

export default defineComponent({
  name: 'Config',
  components: { Container },
  setup() {
    const panelList = usePanelList();
    const activeCell = ref<Cell>(null);

    useGlobalGraph(graph => {
      graph.on(CELL_TRIGGER_TYPE, ({ cell }) => {
        activeCell.value = cell;
        console.log(cell.resize);
      });
      graph.on(CELL_CANCEL_TYPE, () => {
        activeCell.value = null;
      });
    });

    const getPanelTitle = (view: ConfigBarView) => {
      return view.constructor.title;
    };
    // 基于不同启动条件，确定配置面板
    const tabList = computed(() => panelList.filter(([_, v]) => v.activate(unref(activeCell))));
    return { tabList, getPanelTitle };
  },
});
</script>

<style lang="less">
.editor-config {
  width: 360px;
}
</style>
