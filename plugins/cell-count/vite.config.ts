import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './index.ts',
      name: 'plugin-cell-count',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@diagram-editor/diagram-editor'],
      output: {
        exports: 'named',
      },
    },
  },
});
