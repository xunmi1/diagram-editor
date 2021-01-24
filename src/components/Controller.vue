<template>
  <section class="editor-sidebar-wrapper">
    <h4 class="editor-widget-title editor-sidebar-header">属性配置</h4>
    <ATabs v-if="tabList.length" class="editor-sidebar-tabs">
      <template v-for="[key, panel] in tabList" :key="key">
        <ATabPane :tab="panel.title">
          <Suspense>
            <Container
              :view="panel"
              @will-mount="willMount"
              @did-mount="didMount"
              @will-unmount="willUnmount"
              @did-unmount="didUnmount"
            />
            <template #fallback>
              <ASkeleton active :paragraph="{ rows: 10 }" :title="false" class="editor-widget-skeleton" />
            </template>
          </Suspense>
        </ATabPane>
      </template>
    </ATabs>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, shallowReactive, shallowRef, unref, onBeforeUnmount } from 'vue';
import type { Cell } from '@antv/x6';
import { useGlobalGraph, useEditor } from '@/use';
import { ControllerItem } from '@/controller';
import { EventType } from '@/constants';
import Container from './Container';

const CELL_TRIGGER_TYPE = 'cell:click';
const CELL_CANCEL_TYPE = 'blank:click';

type PanelList = [string, ControllerItem][];

const usePanelList = (callback: (item: ControllerItem) => void) => {
  const { controller } = useEditor();
  const panelList = shallowReactive<PanelList>([...controller]);
  panelList.forEach(([_, item]) => callback(item));
  const disposable = controller.onDidLoad(({ key, item }) => {
    panelList.push([key, item]);
    callback(item);
  });
  onBeforeUnmount(() => disposable.dispose());

  return panelList;
};

const useLifecycle = () => {
  const editor = useEditor();
  const willMount = (item: ControllerItem) => {
    item.emit(EventType.CONTROLLER_WILL_MOUNT, editor);
  };
  const didMount = (item: ControllerItem) => {
    item.emit(EventType.CONTROLLER_DID_MOUNT, editor);
  };
  const willUnmount = (item: ControllerItem) => {
    item.emit(EventType.CONTROLLER_WILL_UNMOUNT, editor);
  };
  const didUnmount = (item: ControllerItem) => {
    item.emit(EventType.CONTROLLER_DID_UNMOUNT, editor);
  };

  return { willMount, didMount, willUnmount, didUnmount };
};

export default defineComponent({
  name: 'Controller',
  components: { Container },
  setup() {
    const editor = useEditor();
    const panelList = usePanelList(item => {
      item.created?.(editor);
      onBeforeUnmount(() => {
        item.destroy?.(editor);
      });
    });
    const activeCell = shallowRef<Cell>();

    useGlobalGraph(graph => {
      graph.on(CELL_TRIGGER_TYPE, ({ cell }) => {
        activeCell.value = cell;
      });
      graph.on(CELL_CANCEL_TYPE, () => {
        activeCell.value = undefined;
      });
    });
    const lifecycle = useLifecycle();
    // 基于不同启动条件，确定配置面板
    const tabList = computed(() => panelList.filter(([_, v]) => v.activate(unref(activeCell))));
    return { tabList, ...lifecycle };
  },
});
</script>

<style lang="less">
.editor-sidebar {
  &-wrapper {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border-color);
    background: var(--widget-color);
    height: 100%;
  }
  &-header {
    border-bottom: 1px solid var(--border-color);
  }

  &-tabs {
    flex: auto;
  }
}
</style>
