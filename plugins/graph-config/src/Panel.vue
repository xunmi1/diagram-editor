<template>
  <ConfigProvider>
    <section class="editor-graph-config-panel">
      <AForm :model="state" class="editor-graph-config-form">
        <AFormItem key="gridVisible" label="网格显示">
          <ASwitch v-model:checked="state.gridVisible" />
        </AFormItem>
        <AFormItem key="gridSize" label="网格大小">
          <ASlider
            v-model:value="state.gridSize"
            :min="2"
            :max="200"
            :step="1"
            :get-tooltip-popup-container="getPopupContainer"
          />
        </AFormItem>
        <AFormItem key="backgroundColor" label="背景颜色">
          <ColorPicker v-model:value="state.backgroundColor" />
        </AFormItem>
        <AFormItem key="scrollerEnable" label="画布滚动">
          <ASwitch v-model:checked="state.scrollerEnable" />
        </AFormItem>
        <AFormItem key="scrollerPannable" label="画布平移">
          <ASwitch v-model:checked="state.scrollerPannable" />
        </AFormItem>
      </AForm>
    </section>
  </ConfigProvider>
</template>

<script lang="ts">
import { defineComponent, watchEffect, getCurrentInstance, PropType } from 'vue';
import { ConfigProvider } from '@diagram-editor/shared';
import type { CommandsRegistry } from '@diagram-editor/diagram-editor';
import type { RootProps } from './index';
import ColorPicker from './ColorPicker.vue';
import { CommandId } from './commands';

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
    // eslint-disable-next-line
    const { state, editor } = props;
    const execute: CommandsRegistry['execute'] = (...args) => editor.commands.execute(...args);

    watchEffect(() => execute(CommandId.SET_GRID, { visible: state.gridVisible }));
    watchEffect(() => execute(CommandId.SET_GRID, { size: state.gridSize }));
    watchEffect(() => execute(CommandId.SET_BACKGROUND, { color: state.backgroundColor }));
    watchEffect(() => execute(CommandId.SET_SCROLLER, { enabled: state.scrollerEnable }));
    watchEffect(() => execute(CommandId.SET_SCROLLER, { pannable: state.scrollerPannable }));

    const instance = getCurrentInstance();
    // eslint-disable-next-line
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
