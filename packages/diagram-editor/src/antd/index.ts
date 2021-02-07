import type { Plugin } from 'vue';
import {
  ConfigProvider,
  Collapse,
  Tabs,
  Tooltip,
  Dropdown,
  Menu,
  Skeleton,
  Divider,
  Form,
  Input,
  Select,
  InputNumber,
  Slider,
  Switch,
} from 'ant-design-vue';

import './style.less';
import './scrollbar.less';

const antd: Plugin = app => {
  app.use(ConfigProvider);
  // data display
  app.use(Collapse).use(Tabs).use(Tooltip).use(Skeleton).use(Dropdown).use(Menu).use(Divider);
  // form
  app.use(Form).use(Input).use(InputNumber).use(Slider).use(Switch).use(Select);
};

export default antd;
