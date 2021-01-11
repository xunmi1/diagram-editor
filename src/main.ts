import { createApp } from 'vue';
import App from './App.vue';

class DiagramEditor {
  mount(rootContainer: string) {
    return createApp(App).mount(rootContainer);
  }
}

export default DiagramEditor;
