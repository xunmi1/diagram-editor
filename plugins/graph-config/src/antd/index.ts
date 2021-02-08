import type { Plugin } from 'vue';
import { Tooltip, Form, Input, Select, InputNumber, Slider, Switch } from 'ant-design-vue';

import './style.less';

const antd: Plugin = app => {
  // data display
  app.use(Tooltip);
  // form
  app.use(Form).use(Input).use(InputNumber).use(Slider).use(Switch).use(Select);
};

export default antd;
