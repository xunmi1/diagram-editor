import type { Plugin } from 'vue';
import {
  ConfigProvider,
  Collapse,
  Tabs,
  Tooltip,
  Dropdown,
  Spin,
  Skeleton,
  Form,
  Input,
  Select,
  InputNumber,
  Slider,
  Switch,
} from 'ant-design-vue';

import './style.less';

const antd: Plugin = {
  install(app) {
    app.use(ConfigProvider);
    // data display
    app.use(Collapse).use(Tabs).use(Tooltip).use(Spin).use(Skeleton).use(Dropdown);
    // form
    app.use(Form).use(Input).use(InputNumber).use(Slider).use(Switch).use(Select);
  },
};

export default antd;
