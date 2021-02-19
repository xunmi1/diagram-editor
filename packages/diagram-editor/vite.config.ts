// @ts-ignore
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import watchWorkspaces from './vitePluginWatch';
// @ts-ignore
// import visualizer from 'rollup-plugin-visualizer';

const resolve = (dir: string): string => path.resolve(__dirname, dir);

export default defineConfig({
  plugins: [vue(), jsx(), watchWorkspaces('../../')],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'diagram-editor',
    },
    brotliSize: false,
    rollupOptions: {
      external: ['@antv/x6', 'moment'],
      output: {
        exports: 'named',
        globals: {
          '@antv/x6': 'X6',
          moment: 'moment',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },

  optimizeDeps: {
    include: ['@diagram-editor/shared'],
  },
});
