// @ts-ignore
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';

// @ts-ignore
const resolve = dir => path.resolve(__dirname, dir);

export default defineConfig({
  plugins: [vue(), jsx()],
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      name: 'diagram-editor',
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
  alias: {
    '@': resolve('./src'),
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },

  optimizeDeps: {
    include: ['ant-design-vue/es/locale/zh_CN', '@antv/x6/es/layout/grid'],
  },
});
