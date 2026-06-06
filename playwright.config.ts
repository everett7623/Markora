import { defineConfig } from '@playwright/test';

const useExternalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173'
  },
  webServer: useExternalServer
    ? undefined
    : {
        command: '"C:\\Program Files\\nodejs\\node.exe" scripts/playwright-webserver.mjs',
        port: 4173,
        reuseExistingServer: true
      }
});
