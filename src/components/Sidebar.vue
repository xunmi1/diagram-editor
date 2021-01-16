<template>
  <div class="sidebar">
    <ACollapse v-model:active-key="activeKey" class="sidebar-collapse">
      <template v-for="[key, panel] in panelList" :key="key">
        <ACollapsePanel :panel-key="key" :header="panel.title">
          <div :ref="el => mountContainer(key, el)"></div>
        </ACollapsePanel>
      </template>
    </ACollapse>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, unref, nextTick, onBeforeUnmount } from 'vue';
import { useEditor, useGlobalGraph, useWatchGraph } from '@/use';
import { ShapeType, EventType } from '@/constants';
import { Addon } from '@antv/x6';
import { CellBarView } from '@/cell';

const useDnd = () => {
  const dndRef = ref<Addon.Dnd>();
  const globalGraph = useGlobalGraph();
  useWatchGraph(globalGraph, graph => {
    dndRef.value = new Addon.Dnd({
      target: graph,
      scaled: true,
      animation: true,
    });
  });
  return dndRef;
};

export default defineComponent({
  name: 'Sidebar',
  components: {},
  setup() {
    const editor = useEditor();
    const panelList = reactive<Map<string, CellBarView>>(new Map([...editor.cellBarModel]));
    const cellViewMeta = reactive<Record<string, { isMounted?: boolean } | undefined>>({});
    const dndRef = useDnd();

    editor.on(EventType.CELL_BAR_VIEW_ADDED, ({ key, view }: any) => {
      panelList.set(key, view);
    });

    editor.on(EventType.CELL_BAR_VIEW_MOVE, args => {
      const dnd = unref(dndRef);
      dnd?.start(args.cell, args.e);
    });

    onBeforeUnmount(() => {
      Object.entries(cellViewMeta, (key, meta) => {
        if (!meta.isMounted) return;
        const view = panelList.get(key);
        view?.unmount();
      });
    });

    const mountContainer = async (key: string, el: HTMLElement) => {
      await nextTick();
      if (cellViewMeta[key] == null) cellViewMeta[key] = {};
      const meta = cellViewMeta[key];
      const view = panelList.get(key);
      if (!view) return;
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
