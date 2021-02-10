import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'plugin-actions',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@diagram-editor/diagram-editor'],
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
