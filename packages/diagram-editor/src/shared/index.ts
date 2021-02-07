import { ComponentInternalInstance } from '@vue/runtime-core';

export { default as ConfigProvider } from './ConfigProvider.vue';
export { default as ColorPicker } from './ColorPicker.vue';
export * from './split';
export * from './menu';

export const createPopupContainer = (instance?: ComponentInternalInstance | null) => () => {
  // @ts-ignore
  return instance?.ctx.$root.$el.parentElement.lastElementChild;
};
