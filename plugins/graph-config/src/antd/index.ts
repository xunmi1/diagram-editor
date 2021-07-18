import type { Plugin } from 'vue';
import { ConfigProvider, Dropdown, Tooltip, Form, Input, Select, InputNumber, Slider, Switch } from 'ant-design-vue';

import './style.less';

const antd: Plugin = app => {
  app.use(ConfigProvider);
  // data display
  app.use(Tooltip).use(Dropdown);
  // form
  app.use(Form).use(Input).use(InputNumber).use(Slider).use(Switch).use(Select);
};

export default antd;
