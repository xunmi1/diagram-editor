import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import watchWorkspaces from './vitePluginWatch';
// @ts-ignore
// import visualizer from 'rollup-plugin-visualizer';

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
          '@antv/x6': 'x6',
          moment: 'moment',
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
