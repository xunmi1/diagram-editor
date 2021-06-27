import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(), jsx()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'shared',
      formats: ['es', 'cjs'],
    },
    brotliSize: false,
    rollupOptions: {
      external: ['vue', 'moment'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
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
