<template>
  <div class="sidebar">
    <ACollapse v-model:active-key="activeKey" accordion class="sidebar-collapse">
      <template v-for="[key, panel] in panelList" :key="key">
        <ACollapsePanel :panel-key="key" :header="panel.title">
          <div :ref="el => mountContainer(key, el)"></div>
        </ACollapsePanel>
      </template>
    </ACollapse>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, unref, nextTick } from 'vue';
import { useEditor, useGlobalGraph, useWatchGraph } from '@/use';
import { ShapeType, EventType } from '@/constants';
import { Addon } from '@antv/x6';
import { CellBarView } from '@/cell';

export default defineComponent({
  name: 'Sidebar',
  components: {},
  setup() {
    const dndRef = ref<Addon.Dnd>();
    const editor = useEditor();
    const globalGraph = useGlobalGraph();
    const panelList = reactive<Map<string, CellBarView>>(new Map());
    const cellViewMeta = reactive<{ [key: string]: { isMounted: boolean } }>({});

    editor.on(EventType.CELL_BAR_VIEW_ADDED, ({ key, view }) => {
      panelList.set(key, view);
      cellViewMeta[key] = {};
    });

    editor.on(EventType.CELL_BAR_VIEW_MOVE, args => {
      const dnd = unref(dndRef);
      dnd.start(args.cell, args.e);
    });

    useWatchGraph(globalGraph, graph => {
      dndRef.value = new Addon.Dnd({
        target: graph,
        scaled: true,
        animation: true,
      });
    });

    const mountContainer = async (key, el) => {
      await nextTick();
      const meta = cellViewMeta[key];
      if (meta.isMounted) return;
      const view = panelList.get(key);
      view.mount(el);
      meta.isMounted = true;
    };

    const activeKey = ref([ShapeType.NODE_BASE]);
    return { panelList, activeKey, mountContainer };
  },
});
</script>

<style lang="less">
.sidebar {
  width: 248px;
}
</style>
