<template>
  <section class="editor-explorer-wrapper editor-flex-col">
    <ACollapse v-model:active-key="activeKey" class="editor-explorer-collapse editor-flex-col">
      <template v-for="[key, panel] in panelList" :key="key">
        <ACollapsePanel :panel-key="key" :header="panel.title">
          <Suspense>
            <Container
              :view="panel"
              @will-mount="willMount"
              @did-mount="didMount"
              @will-unmount="willUnmount"
              @did-unmount="didUnmount"
            />
            <template #fallback>
              <ASkeleton active :paragraph="{ rows: 6 }" :title="false" class="editor-widget-skeleton" />
            </template>
          </Suspense>
        </ACollapsePanel>
      </template>
    </ACollapse>
  </section>
</template>

<script lang="ts">
import { defineComponent, shallowReactive, shallowRef, ref, unref, onBeforeUnmount } from 'vue';
import { useEditor, useGlobalGraph } from '../use';
import { Addon, Cell } from '@antv/x6';
import type { ExplorerItem } from '../explorer';
import Container from './Container';
import type { Node } from '@antv/x6/lib/model/node';
import { EventType } from '../constants';

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

type PanelList = Map<string, ExplorerItem>;

const usePanelList = (callback: (item: ExplorerItem) => void) => {
  const { explorer } = useEditor();
  const panelList = shallowReactive<PanelList>(new Map([...explorer]));
  explorer.forEach(callback);

  const disposable = explorer.onDidLoad(({ key, item }) => {
    panelList.set(key, item);
    callback(item);
  });
  onBeforeUnmount(() => disposable.dispose());

  return panelList;
};

const useLifecycle = () => {
  const editor = useEditor();
  const willMount = (item: ExplorerItem) => {
    item.emit(EventType.EXPLORER_WILL_MOUNT, editor);
  };
  const didMount = (item: ExplorerItem) => {
    item.emit(EventType.EXPLORER_DID_MOUNT, editor);
  };
  const willUnmount = (item: ExplorerItem) => {
    item.emit(EventType.EXPLORER_WILL_UNMOUNT, editor);
  };
  const didUnmount = (item: ExplorerItem) => {
    item.emit(EventType.EXPLORER_DID_UNMOUNT, editor);
  };

  return { willMount, didMount, willUnmount, didUnmount };
};

export default defineComponent({
  name: 'Explorer',
  components: { Container },
  setup() {
    const editor = useEditor();
    const dndRef = useDnd();

    const drag = (args: { cell: Cell; event: MouseEvent }) => {
      const dnd = unref(dndRef);
      dnd?.start(args.cell as Node, args.event);
    };

    const panelList = usePanelList(item => {
      item.created?.(editor);
      item.onWillDrag?.(drag);
      onBeforeUnmount(() => {
        item.destroy?.(editor);
        item.dispose();
      });
    });

    // 第一个 bar 的 key
    const activeKey = ref([...panelList][0]?.[0]);

    const lifecycle = useLifecycle();

    return { panelList, activeKey, ...lifecycle };
  },
});
</script>

<style lang="less">
.editor-explorer {
  &-wrapper {
    height: 100%;
    border-right: 1px solid var(--border-color);
    background: var(--widget-color);
    overflow: auto;
  }

  &-collapse {
    flex: auto;
    border-right: none !important;
    border-top: none !important;

    .editor-collapse-header {
      position: sticky !important;
      z-index: 1000;
      top: 0;
      background-color: var(--widget-color);
      box-shadow: 0 1px 4px var(--border-color);
    }
  }
}
</style>
