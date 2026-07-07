import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const manifestPath = path.join(distDir, 'manifest.json');

const candidates = {
  chrome: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA ?? '', 'Google\\Chrome\\Application\\chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable'
  ],
  edge: [
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/microsoft-edge',
    '/usr/bin/microsoft-edge-stable'
  ]
};

function findBrowser(name) {
  return candidates[name].find((candidate) => candidate && existsSync(candidate));
}

function runBrowser(name, executable) {
  const profileDir = mkdtempSync(path.join(tmpdir(), `markora-${name}-`));
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
  const executable = findBrowser(name);
  if (!executable) throw new Error(`Unable to find ${name} executable for browser check.`);
  console.log(`Checking ${name}: ${executable}`);
  await runBrowser(name, executable);
}

console.log('Chrome and Edge accepted the production dist/ extension in headless load checks.');
