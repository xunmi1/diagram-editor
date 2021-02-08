import { getCurrentInstance } from 'vue';

export * from './components';
export * from './utils';

export const getPopupContainer = (instance = getCurrentInstance()) => () => {
  // @ts-ignore
  return instance?.ctx.$root.$el.parentElement.lastElementChild;
};
