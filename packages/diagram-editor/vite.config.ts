// @ts-ignore
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import watchWorkspaces from './vitePluginWatch';

// @ts-ignore
const resolve = dir => path.resolve(__dirname, dir);

export default defineConfig({
  plugins: [vue(), jsx(), watchWorkspaces('../../', ['@diagram-editor/shared'])],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'diagram-editor',
    },
    brotliSize: false,
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
    include: ['@antv/x6/es/layout/grid', '@diagram-editor/shared'],
  },
});
