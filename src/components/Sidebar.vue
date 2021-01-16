<template>
  <div v-show="panelList.size" class="sidebar">
    <ACollapse v-model:active-key="activeKey" class="sidebar-collapse">
      <template v-for="[key, panel] in panelList" :key="key">
        <ACollapsePanel :panel-key="key" :header="panel.title">
          <div v-once :ref="el => render(key, el)"></div>
        </ACollapsePanel>
      </template>
    </ACollapse>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, unref, nextTick, onBeforeUnmount } from 'vue';
import { useEditor, useGlobalGraph, useWatchGraph } from '@/use';
import { EventType } from '@/constants';
import { Addon } from '@antv/x6';
import { CellBarModel, CellBarView } from '@/cell';

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

const useMount = (panelList: Map<string, CellBarView>, cellBarModel: CellBarModel) => {
  return async (key: string, el: HTMLElement) => {
    await nextTick();
    const meta = cellBarModel.getMeta(key);
    if (meta.isMounted) return;
    const view = panelList.get(key);
    if (!view) return;
    view.mount(el);
    cellBarModel.updateMeta(key, { isMounted: true });
  };
};

const useUnmount = (panelList: Map<string, CellBarView>, cellBarModel: CellBarModel) => {
  const list = [...panelList];
  onBeforeUnmount(() => {
    list.forEach(([key, view]) => {
      const meta = cellBarModel.getMeta(key);
      if (!meta.isMounted) return;
      view?.unmount();
    });
  });
};

export default defineComponent({
  name: 'Sidebar',
  components: {},
  setup() {
    const editor = useEditor();
    const cellBarModel = editor.cellBarModel;
    const panelList = reactive<Map<string, CellBarView>>(new Map(cellBarModel));
    // 第一个 bar 的 key
    const activeKey = ref([...cellBarModel][0]?.[0]);
    const dndRef = useDnd();

    editor.on(EventType.CELL_BAR_VIEW_ADDED, ({ key, view }: any) => {
      panelList.set(key, view);
    });

    editor.on(EventType.CELL_BAR_VIEW_MOVE, args => {
      const dnd = unref(dndRef);
      dnd?.start(args.cell, args.e);
    });

    const render = useMount(panelList, cellBarModel);
    useUnmount(panelList, cellBarModel);

    return { panelList, activeKey, render };
  },
});
</script>

<style lang="less">
.sidebar {
  width: 248px;
}
</style>
