<template>
  <AConfigProvider :locale="locale" :get-popup-container="getPopupContainer" prefix-cls="editor" v-bind="$attrs">
    <slot />
  </AConfigProvider>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import { ConfigProvider as AConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default defineComponent({
  name: 'ConfigProvider',
  components: {
    AConfigProvider,
  },
  setup() {
    const locale = Object.freeze(zhCN);
    const instance = getCurrentInstance();
    const getPopupContainer = () => instance?.appContext.app._container;

    return { locale, getPopupContainer };
  },
});
</script>

<style>
@import 'ant-design-vue/es/config-provider/style/index.css';
</style>
