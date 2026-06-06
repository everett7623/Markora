import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const manifestPath = resolve(distDir, 'manifest.json');

if (!existsSync(manifestPath)) {
  throw new Error('Missing dist/manifest.json. Run npm run build first.');
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.manifest_version !== 3) {
  throw new Error('Built extension must use Manifest V3.');
}

const serviceWorker = manifest.background?.service_worker;
if (typeof serviceWorker !== 'string' || !existsSync(resolve(distDir, serviceWorker))) {
  throw new Error('Built extension has no loadable background service worker.');
}

const filesToCheck = [manifestPath, resolve(distDir, serviceWorker)];
const developmentMarkers = ['localhost:', '127.0.0.1:', '/@vite/', '@crx/client'];
for (const file of filesToCheck) {
  const source = readFileSync(file, 'utf8');
  const marker = developmentMarkers.find((candidate) => source.includes(candidate));
  if (marker) throw new Error(`Development marker "${marker}" found in ${file}.`);
}

const exposedResources = manifest.web_accessible_resources?.flatMap((entry) => entry.resources ?? []) ?? [];
if (exposedResources.includes('*') || exposedResources.includes('**/*')) {
  throw new Error('Production manifest must not expose every extension resource.');
}

console.log('Extension build validation passed.');
