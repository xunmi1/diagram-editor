import type { Plugin } from 'vue';
import { Collapse } from 'ant-design-vue';
import './style.less';

const antd: Plugin = {
  install(app) {
    app.use(Collapse);
  },
};

export default antd;
