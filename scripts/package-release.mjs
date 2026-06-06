import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const manifestPath = resolve(distDir, 'manifest.json');

if (!existsSync(manifestPath)) {
  console.error('Missing dist/manifest.json. Run npm run build first.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.manifest_version !== 3 || typeof manifest.version !== 'string') {
  console.error('The built manifest is invalid or is not Manifest V3.');
  process.exit(1);
}

const serviceWorkerPath = resolve(distDir, manifest.background?.service_worker ?? '');
if (!manifest.background?.service_worker || !existsSync(serviceWorkerPath)) {
  console.error('The built manifest references a missing background service worker.');
  process.exit(1);
}

const manifestSource = JSON.stringify(manifest);
const serviceWorkerSource = readFileSync(serviceWorkerPath, 'utf8');
const developmentMarkers = ['localhost:', '127.0.0.1:', '/@vite/', '@crx/client'];
if (developmentMarkers.some((marker) => manifestSource.includes(marker) || serviceWorkerSource.includes(marker))) {
  console.error('Refusing to package a development build. Run npm run build and try again.');
  process.exit(1);
}

const exposedResources = manifest.web_accessible_resources?.flatMap((entry) => entry.resources ?? []) ?? [];
if (exposedResources.includes('*') || exposedResources.includes('**/*')) {
  console.error('Refusing to package a manifest that exposes every extension resource.');
  process.exit(1);
}

const releaseDir = resolve(root, 'release');
const archivePath = resolve(releaseDir, `markora-v${manifest.version}.zip`);
mkdirSync(releaseDir, { recursive: true });
rmSync(archivePath, { force: true });

const command = [
  '-NoProfile',
  '-ExecutionPolicy',
  'Bypass',
  '-Command',
  `Compress-Archive -Path '${distDir.replaceAll("'", "''")}\\*' -DestinationPath '${archivePath.replaceAll("'", "''")}' -Force`
];
const packaged = spawnSync('powershell.exe', command, { stdio: 'inherit' });

if (packaged.status !== 0 || !existsSync(archivePath)) {
  console.error('Unable to create the release archive.');
  process.exit(packaged.status ?? 1);
}

console.log(`Created ${archivePath}`);
