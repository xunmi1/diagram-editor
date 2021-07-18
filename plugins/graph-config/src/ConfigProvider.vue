<template>
  <AConfigProvider :get-popup-container="getPopupContainer" :prefix-cls="prefixClass" v-bind="$attrs">
    <slot />
  </AConfigProvider>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import type Dialog from 'ant-design-vue/es/vc-dialog/Dialog';

type DialogContext = InstanceType<typeof Dialog>;

export default defineComponent({
  name: 'ConfigProvider',
  setup() {
    const prefixClass = 'editor';
    const instance = getCurrentInstance();
    const getPopupContainer = (el?: HTMLElement, dialogContext?: DialogContext) => {
      if (dialogContext) return dialogContext.getDialogWrap();
      // eslint-disable-next-line
      return instance?.appContext.app._container as HTMLElement;
    };
    return { prefixClass, getPopupContainer };
  },
});
</script>
