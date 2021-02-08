<template>
  <ConfigProvider>
    <section class="editor-graph-config-panel">
      <AForm :model="state" class="editor-graph-config-form">
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
import { defineComponent, watchEffect, getCurrentInstance, PropType } from 'vue';
import { ConfigProvider } from '@diagram-editor/shared';
import type { RootProps } from './index';
import type { CommandsRegistry } from '@diagram-editor/diagram-editor';
import ColorPicker from './ColorPicker.vue';

export default defineComponent({
  name: 'Panel',
  components: {
    ConfigProvider,
    ColorPicker,
  },
  props: {
    editor: {
      type: Object as PropType<RootProps['editor']>,
      required: true,
    },
    state: {
      type: Object as PropType<RootProps['state']>,
      required: true,
    },
  },
  setup(props) {
    const { state, editor } = props;
    const execute: CommandsRegistry['execute'] = (...args) => editor.commands.execute(...args);

    watchEffect(() => execute('editor.setGrid', { visible: state.gridVisible }));
    watchEffect(() => execute('editor.setGrid', { size: state.gridSize }));
    watchEffect(() => execute('editor.setBackground', { color: state.backgroundColor }));
    watchEffect(() => execute('editor.setScroller', { enabled: state.scrollerEnable }));
    watchEffect(() => execute('editor.setScroller', { pannable: state.scrollerPannable }));

    const instance = getCurrentInstance();
    const getPopupContainer = () => instance?.appContext.app._container;
    return { getPopupContainer };
  },
});
</script>

<style lang="less">
.editor-graph-config {
  &-panel {
    padding: var(--padding-md);
  }

  &-form {
    .editor-form-item {
      display: flex;
      margin-bottom: var(--padding-sm);

      &-label {
        min-width: 80px;
      }

      &-control-wrapper {
        flex: auto;
      }
    }
  }
}
</style>
