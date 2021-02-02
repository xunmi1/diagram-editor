<template>
  <AConfigProvider :locale="locale" :get-popup-container="getPopupContainer" prefix-cls="editor">
    <slot />
  </AConfigProvider>
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { createPopupContainer } from '@/shared';

import { defineComponent, getCurrentInstance } from 'vue';

export default defineComponent({
  name: 'ConfigProvider',
  setup() {
    const locale = zhCN;
    const instance = getCurrentInstance()!;

    const getPopupContainer = createPopupContainer(instance);

    return { locale, getPopupContainer };
  },
});
</script>
