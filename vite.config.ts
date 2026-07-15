import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import manifest from './manifest.json';

function copyLicense(): Plugin {
  return {
    name: 'copy-license',
    apply: 'build',
    writeBundle(outputOptions) {
      if (!outputOptions.dir) throw new Error('Production build output directory is missing.');
      copyFileSync(resolve('LICENSE'), resolve(outputOptions.dir, 'LICENSE'));
    }
  };
}

export default defineConfig(({ command }) => ({
  plugins: [react(), crx({ manifest }), copyLicense()],
  build: {
    outDir: command === 'serve' ? '.crx-dev' : 'dist',
    emptyOutDir: true
  }
}));
