import { DefineComponent } from 'vue';
import type { ConfigConsumerProps } from 'ant-design-vue/es/config-provider';

import SplitImpl from './split/Split.vue';
import SplitPanelImpl from './split/SplitPanel.vue';
import ConfigProviderImpl from './ConfigProvider.vue';

export const Split = SplitImpl as unknown as DefineComponent<{ threshold?: number; sashSize?: number }>;
export const SplitPanel = SplitPanelImpl as unknown as DefineComponent<{ flexible?: boolean }>;
export const ConfigProvider = ConfigProviderImpl as unknown as DefineComponent<ConfigConsumerProps>;
