import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const isCdn = mode === 'cdn';

  return {
    plugins: [
      react(),
      tailwindcss(),
      !isCdn &&
        dts({
          insertTypesEntry: true,
          outDir: 'dist',
          entryRoot: 'src',
          rollupTypes: true,
          tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
        }),
    ].filter(Boolean),

    esbuild: { jsx: 'automatic' },

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
          'cdn',
          'storybook-static',
          '.storybook',
          '**/*.stories.tsx',
          '**/*.types.ts',
          '**/*.d.ts',
          '**/*.mdx',
          '**/index.ts',
          '**/index-wc.ts',
          '**/main.tsx',
        ],
      },
    },

    build: isCdn
      ? {
          outDir: 'cdn',
          emptyOutDir: true,
          lib: {
            entry: path.resolve(__dirname, 'src/index-wc.ts'),
            name: 'HansUIDesignLib',
            formats: ['iife'],
            fileName: () => `hans-ui-web-components.js`,
          },
          rollupOptions: {
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          },
        }
      : {
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
          outDir: 'dist',
        },

    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env': {},
    },
  };
});
