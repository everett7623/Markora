import { spawn } from 'node:child_process';
import { createServer } from 'vite';
import { findChromiumExecutable } from './browser-paths.mjs';

const server = await createServer({
  server: {
    host: '127.0.0.1',
    port: 4173
  }
});

await server.listen();

const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test'], {
  env: {
    ...process.env,
    PLAYWRIGHT_EXTERNAL_SERVER: '1',
    PLAYWRIGHT_CHROMIUM_EXECUTABLE: findChromiumExecutable()
  },
  stdio: 'inherit'
});

const exitCode = await new Promise((resolve) => {
  child.on('exit', (code) => resolve(code ?? 1));
});

await server.close();
process.exit(exitCode);
