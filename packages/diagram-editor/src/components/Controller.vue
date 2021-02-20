<template>
  <section class="editor-controller-wrapper editor-flex-col">
    <ATabs class="editor-controller-tabs">
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
import { defineComponent, watch, shallowReactive, shallowRef, onBeforeUnmount, getCurrentInstance } from 'vue';
import type { Cell } from '@antv/x6';
import { useEditor } from '@/use';
import { ControllerItem } from '@/controller';
import { EventType } from '@/constants';
import Container from './Container';

type PanelList = Map<string, ControllerItem>;

const usePanelList = (callback: (item: ControllerItem) => void) => {
  const { controller } = useEditor();
  const panelList = shallowReactive<PanelList>(new Map([...controller]));
  controller.forEach(callback);
  const disposable = controller.onDidLoad(({ key, item }) => {
    panelList.set(key, item);
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

const useActiveCell = () => {
  const editor = useEditor();
  const activeCell = shallowRef<Cell>();
  const disposable = editor.onDidChangeActiveCell(() => {
    activeCell.value = editor.activeCell;
  });
  onBeforeUnmount(() => disposable.dispose());
  return activeCell;
};

export default defineComponent({
  name: 'Controller',
  components: { Container },
  setup() {
    const editor = useEditor();
    const instance = getCurrentInstance();
    const panelList = usePanelList(item => {
      item.created?.(editor);
      onBeforeUnmount(() => {
        item.destroy?.(editor);
        item.dispose();
      }, instance);
    });
    const activeCell = useActiveCell();
    const lifecycle = useLifecycle();
    const getActiveList = (): [string, ControllerItem][] =>
      // eslint-disable-next-line
      [...panelList].filter(([_, v]) => v.activate?.(editor) ?? true);
    const tabList = shallowRef<[string, ControllerItem][]>([]);
    watch(activeCell, () => (tabList.value = getActiveList()), { immediate: true });

    return { tabList, ...lifecycle };
  },
});
</script>

<style lang="less">
.editor-controller {
  &-wrapper {
    border-left: 1px solid var(--border-color);
    background: var(--widget-color);
    height: 100%;
    overflow: auto;
  }

  & > &-tabs {
    flex: auto;
    overflow-y: auto;

    .editor-tabs-top-bar {
      position: sticky;
      z-index: 1000;
      top: 0;
      background-color: var(--widget-color);
      box-shadow: 0 1px 4px var(--border-color);
    }
  }
}
</style>
