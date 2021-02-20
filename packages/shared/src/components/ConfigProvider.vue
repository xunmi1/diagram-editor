<template>
  <AConfigProvider :locale="locale" :get-popup-container="getPopupContainer" :prefix-cls="prefixClass" v-bind="$attrs">
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
    const prefixClass = 'editor';
    const instance = getCurrentInstance();
    const getPopupContainer = () => (instance?.appContext.app._container as HTMLElement).firstElementChild;

    return { locale, prefixClass, getPopupContainer };
  },
});
</script>

<style>
@import 'ant-design-vue/es/config-provider/style/index.css';
</style>
