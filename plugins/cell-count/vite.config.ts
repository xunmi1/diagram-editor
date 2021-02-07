// @ts-ignore
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './index.ts',
      name: 'plugin-cell-count',
    },
    brotliSize: false,
    rollupOptions: {
      external: ['@diagram-editor/diagram-editor'],
      output: {
        exports: 'named',
      },
    },
  },
});
