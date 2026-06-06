import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import manifest from './manifest.json';

export default defineConfig(({ command }) => ({
  plugins: [react(), crx({ manifest })],
  build: {
    outDir: command === 'serve' ? '.crx-dev' : 'dist',
    emptyOutDir: true
  }
}));
