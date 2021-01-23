<template>
  <section class="editor-sidebar-wrapper">
    <h4 class="editor-widget-title editor-sidebar-header">资源管理器</h4>
    <ACollapse v-model:active-key="activeKey" class="editor-sidebar-collapse">
      <template v-for="[key, panel] in panelList" :key="key">
        <ACollapsePanel :panel-key="key" :header="getPanelTitle(panel)">
          <Suspense>
            <Container :view="panel" @mounted="mounted" @unmounted="unmounted" />
            <template #fallback>
              <ASkeleton active :paragraph="{ rows: 4 }" :title="false" class="editor-widget-skeleton" />
            </template>
          </Suspense>
        </ACollapsePanel>
      </template>
    </ACollapse>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, shallowRef, ref, unref } from 'vue';
import { useEditor, useGlobalGraph } from '@/use';
import { EventType } from '@/constants';
import { Addon, Cell } from '@antv/x6';
import type { ExplorerItem } from '@/explorer';
import Container from './Container';

const useDnd = () => {
  const dndRef = shallowRef<Addon.Dnd>();
  useGlobalGraph(graph => {
    dndRef.value = new Addon.Dnd({
      target: graph,
      scaled: true,
      animation: true,
    });
  });
  return dndRef;
};

type PanelList = [string, ExplorerItem][];

const createView = (Ctor: typeof ExplorerItem, ...args) => {
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

    const getPanelTitle = (view: ExplorerItem) => {
      return view.constructor.title;
    };

    const drag = (args: { cell: Cell; event: MouseEvent }) => {
      const dnd = unref(dndRef);
      dnd?.start(args.cell, args.event);
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
.editor-sidebar {
  &-wrapper {
    border-right: 1px solid var(--border-color);
    background: var(--widget-color);
  }
  &-header {
    border-bottom: 1px solid var(--border-color);
  }
  &-collapse {
    border-right: none !important;
    border-top: none !important;
  }
}
</style>
