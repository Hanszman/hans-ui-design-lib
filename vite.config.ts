import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const isCdn = mode === 'cdn';
  const isTest = process.env.VITEST === 'true';
  const isBuild = process.env.NODE_ENV === 'production' && !isTest;

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
          exclude: ['src/index-wc.ts', 'src/utils/reactToWebComponent.ts'],
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
          '**/config-cdn.ts',
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
          cssCodeSplit: false,
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

    define: isBuild
      ? {
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env': {},
        }
      : {},
  };
});
