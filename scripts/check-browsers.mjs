import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { findBrowserExecutable } from './browser-paths.mjs';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const manifestPath = path.join(distDir, 'manifest.json');

function runBrowser(name, executable) {
  const profileDir = mkdtempSync(path.join(tmpdir(), `favgrove-${name}-`));
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profileDir}`,
    `--disable-extensions-except=${distDir}`,
    `--load-extension=${distDir}`,
    '--dump-dom',
    'about:blank'
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`${name} did not finish the extension load check within 20 seconds.`));
    }, 20_000);

    child.on('error', (error) => {
      clearTimeout(timer);
      rmSync(profileDir, { recursive: true, force: true });
      reject(error);
    });

    child.on('exit', (code) => {
      clearTimeout(timer);
      rmSync(profileDir, { recursive: true, force: true });
      if (code === 0) resolve();
      else reject(new Error(`${name} exited with code ${code}.`));
    });
  });
}

if (!existsSync(manifestPath)) {
  throw new Error('dist/manifest.json is missing. Run npm run build:extension first.');
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.manifest_version !== 3 || !manifest.options_ui?.open_in_tab) {
  throw new Error('dist manifest is not the expected Manifest V3 options-page extension.');
}

for (const name of ['chrome', 'edge']) {
  const executable = findBrowserExecutable(name);
  if (!executable) throw new Error(`Unable to find ${name} executable for browser check.`);
  console.log(`Checking ${name}: ${executable}`);
  await runBrowser(name, executable);
}

console.log('Chrome and Edge accepted the production dist/ extension in headless load checks.');
