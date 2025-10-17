import { defineConfig } from 'vite';
import path from 'node:path';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: './', // importante para assets quando deployar em Vercel
  build: {
    outDir: 'cdn', // pasta de saída específica para MF
    // preserveFiles: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/mf/webcomponents-init.ts'),
    },
  },
  plugins: [
    federation({
      name: 'hans_ui_lib', // nome do remote
      filename: 'remoteEntry.js', // arquivo gerado
      exposes: {
        // expose a função que define os webcomponents
        './define': './src/mf/webcomponents-init.ts',
        // também expose seus componentes ESM pra hosts React se quiser
        // './Button': './src/components/Forms/Button/Button',
        // './Icon': './src/components/Icon/Icon',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});
