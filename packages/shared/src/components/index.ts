import { DefineComponent } from 'vue';
import type { ConfigConsumerProps } from 'ant-design-vue/es/config-provider';

import { default as SplitImpl } from './split/Split.vue';
import { default as SplitPanelImpl } from './split/SplitPanel.vue';
import { default as ConfigProviderImpl } from './ConfigProvider.vue';

export const Split = SplitImpl as any as DefineComponent<{ threshold?: number; sashSize?: number }>;
export const SplitPanel = SplitPanelImpl as any as DefineComponent<{ flexible?: boolean }>;
export const ConfigProvider = ConfigProviderImpl as any as DefineComponent<ConfigConsumerProps>;
