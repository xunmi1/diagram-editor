<template>
  <ConfigProvider>
    <section class="editor-graph-config-panel">
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
    </section>
  </ConfigProvider>
</template>

<script lang="ts">
import { defineComponent, watchEffect, getCurrentInstance } from 'vue';
import { ConfigProvider, ColorPicker, createPopupContainer } from '@/shared';
import type { RootProps } from './index';
import type { CommandsRegistry } from '@/utils';

export default defineComponent({
  name: 'Panel',
  components: {
    ConfigProvider,
    ColorPicker,
  },
  props: ['editor', 'state'],
  setup(props) {
    const state = props.state as RootProps['state'];
    const editor = props.editor as RootProps['editor'];
    const execute: CommandsRegistry['execute'] = (...args) => editor.commands.execute(...args);

    watchEffect(() => execute('editor.setGrid', { visible: state.gridVisible }));
    watchEffect(() => execute('editor.setGrid', { size: state.gridSize }));
    watchEffect(() => execute('editor.setBackground', { color: state.backgroundColor }));
    watchEffect(() => execute('editor.setScroller', { enabled: state.scrollerEnable }));
    watchEffect(() => execute('editor.setScroller', { pannable: state.scrollerPannable }));

    const instance = getCurrentInstance();
    const getPopupContainer = createPopupContainer(instance);
    return { state, getPopupContainer };
  },
});
</script>

<style lang="less">
.editor-graph-config-panel {
  padding: var(--padding-md);
}
</style>
