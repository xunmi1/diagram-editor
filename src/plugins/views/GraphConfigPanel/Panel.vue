<template>
  <ConfigProvider>
    <section class="editor-graph-config-panel">
      <ASpin :spinning="spinning">
        <AForm :model="state" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <AFormItem label="网格显示" key="gridVisible">
            <ASwitch v-model:checked="state.gridVisible" />
          </AFormItem>
          <AFormItem label="网格大小" key="gridSize">
            <ASlider
              v-model:value="state.gridSize"
              :min="2"
              :max="200"
              :step="1"
              :get-tooltip-popup-container="getPopupContainer"
            />
          </AFormItem>
          <AFormItem label="背景颜色" key="backgroundColor">
            <ColorPicker v-model:value="state.backgroundColor" />
          </AFormItem>
          <AFormItem label="画布滚动" key="scrollerEnable">
            <ASwitch v-model:checked="state.scrollerEnable" />
          </AFormItem>
          <AFormItem label="画布平移" key="scrollerPannable">
            <ASwitch v-model:checked="state.scrollerPannable" />
          </AFormItem>
        </AForm>
      </ASpin>
    </section>
  </ConfigProvider>
</template>

<script lang="ts">
import { defineComponent, watchEffect, getCurrentInstance, ref, onBeforeUnmount } from 'vue';
import { ConfigProvider, ColorPicker, createPopupContainer } from '@/shared';
import { EventType } from '@/constants';
import { delay } from '@/utils';
import type { RootProps } from './index';

const useSpin = editor => {
  const spinning = ref(!editor.graph);
  const handler = async () => {
    await delay(200);
    spinning.value = false;
  };

  editor.on(EventType.EDITOR_MOUNTED, handler);
  onBeforeUnmount(() => {
    editor.off(EventType.EDITOR_MOUNTED, handler);
  });

  return spinning;
};

export default defineComponent({
  name: 'Panel',
  components: {
    ConfigProvider,
    ColorPicker,
  },
  props: ['editor', 'state'],
  setup(props: RootProps) {
    const state = props.state;
    const editor = props.editor;
    const spinning = useSpin(editor);
    const execute = (...args) => editor.commands.execute(...args);

    watchEffect(() => execute('editor.setGrid', { visible: state.gridVisible }));
    watchEffect(() => execute('editor.setGrid', { size: state.gridSize }));
    watchEffect(() => execute('editor.setBackground', { color: state.backgroundColor }));
    watchEffect(() => execute('editor.setScroller', { enabled: state.scrollerEnable }));
    watchEffect(() => execute('editor.setScroller', { pannable: state.scrollerPannable }));

    const instance = getCurrentInstance();
    const getPopupContainer = createPopupContainer(instance);
    return { spinning, state, getPopupContainer };
  },
});
</script>

<style lang="less">
.editor-graph-config-panel {
  padding: var(--padding-middle);
}
</style>
