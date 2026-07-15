import { defineConfig } from '@playwright/test';

const useExternalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: executablePath ? { executablePath } : undefined
  },
  webServer: useExternalServer
    ? undefined
    : {
        command: '"C:\\Program Files\\nodejs\\node.exe" scripts/playwright-webserver.mjs',
        port: 4173,
        reuseExistingServer: true
      }
});
