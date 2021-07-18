import type { Plugin } from 'vue';
import { ConfigProvider, Collapse, Tabs, Tooltip, Dropdown, Menu, Skeleton, Divider } from 'ant-design-vue';

import './style.less';

const antd: Plugin = app => {
  app.use(ConfigProvider);
  // data display
  app.use(Collapse).use(Tabs).use(Tooltip).use(Skeleton).use(Dropdown).use(Menu).use(Divider);
};

export default antd;
