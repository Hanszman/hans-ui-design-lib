import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules',
        'dist',
        'storybook-static',
        '.storybook',
        '.vscode',
        '**/*.stories.tsx',
        '**/*.model.ts',
        '**/*.mdx',
        '**/index.ts',
        '**/main.tsx',
      ],
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'HansUiDesignLib',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
    cssCodeSplit: true,
  },
});
