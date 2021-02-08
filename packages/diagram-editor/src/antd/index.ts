import type { Plugin } from 'vue';
import { Collapse, Tabs, Tooltip, Dropdown, Menu, Skeleton, Divider } from 'ant-design-vue';

import './style.less';
import './scrollbar.less';

const antd: Plugin = app => {
  // data display
  app.use(Collapse).use(Tabs).use(Tooltip).use(Skeleton).use(Dropdown).use(Menu).use(Divider);
};

export default antd;
