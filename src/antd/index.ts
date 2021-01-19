import type { Plugin } from 'vue';
import { Collapse, Tabs } from 'ant-design-vue';

import './style.less';

const antd: Plugin = {
  install(app) {
    app.use(Collapse);
    app.use(Tabs);
  },
};

export default antd;
