import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'plugin-graph-config',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@diagram-editor/diagram-editor', 'moment'],
      output: {
        exports: 'named',
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
