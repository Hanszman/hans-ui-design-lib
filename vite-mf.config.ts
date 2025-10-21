import { defineConfig } from 'vite';
import path from 'node:path';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: './',
  build: {
    outDir: 'cdn',
    target: 'esnext',
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__dirname, 'src/mf/webcomponents-init.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
  plugins: [
    federation({
      name: 'hans_ui_lib',
      filename: 'remoteEntry.js',
      exposes: {
        './define': './src/mf/webcomponents-init.ts',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});
