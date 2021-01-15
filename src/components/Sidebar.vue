<template>
  <div class="sidebar">
    <ACollapse v-model:active-key="activeKey" accordion class="sidebar-collapse">
      <template v-for="[key, panel] in panelList" :key="key">
        <ACollapsePanel :panel-key="key" :header="panel.title">
          <div ref="container">111</div>
        </ACollapsePanel>
      </template>
    </ACollapse>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, unref } from 'vue';
import { useGlobalGraph, useGraph, useWatchGraph } from '@/use';
import { ShapeType } from '@/constants';
import { BasicRect } from '@/shapes';
import { Addon } from '@antv/x6';

interface Panel {
  title: string;
}

type PanelMap<T extends string | number = ShapeType> = Map<T, Panel>;

const panelMap: PanelMap = new Map([
  [ShapeType.NODE_BASE, { title: '基础节点' }],
  [ShapeType.NODE_COMBINATION, { title: '组合节点' }],
]);

export default defineComponent({
  name: 'Sidebar',
  components: {},
  setup() {
    const { container, graph: graphRef } = useGraph({
      height: 300,
      interacting: false,
      preventDefaultBlankAction: false,
    });
    const dndRef = ref<Addon.Dnd>();

    useGlobalGraph(graph => {
      dndRef.value = new Addon.Dnd({
        target: graph,
        scaled: true,
        animation: true,
      });
    });

    useWatchGraph(graphRef, graph => {
      graph.addNode(new BasicRect());
      graph.fitToContent({ gridHeight: 1, padding: 12 });
      graph.on('node:mousedown', args => {
        const dnd = unref(dndRef);
        dnd.start(args.node, args.e);
      });
    });

    const panelList = reactive<PanelMap>(panelMap);
    const activeKey = ref([ShapeType.NODE_BASE]);
    return { container, panelList, activeKey };
  },
});
</script>

<style lang="less">
.sidebar {
  width: 248px;
}
</style>
