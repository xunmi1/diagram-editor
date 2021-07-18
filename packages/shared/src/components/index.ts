import { DefineComponent } from 'vue';

import SplitImpl from './split/Split.vue';
import SplitPanelImpl from './split/SplitPanel.vue';

export const Split = SplitImpl as unknown as DefineComponent<{ threshold?: number; sashSize?: number }>;
export const SplitPanel = SplitPanelImpl as unknown as DefineComponent<{ flexible?: boolean }>;
