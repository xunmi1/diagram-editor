<template>
  <AConfigProvider :locale="locale" :get-popup-container="getContainer" prefix-cls="editor" v-bind="$attrs">
    <slot />
  </AConfigProvider>
</template>

<script lang="ts">
import { ConfigProvider as AConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { getPopupContainer } from '../index';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConfigProvider',
  components: {
    AConfigProvider,
  },
  setup() {
    const locale = Object.freeze(zhCN);
    const getContainer = getPopupContainer();

    return { locale, getContainer };
  },
});
</script>
