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

const requiredIconSizes = [16, 48, 128];
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function validateIconSet(iconSet, label) {
  if (!iconSet || typeof iconSet !== 'object') {
    throw new Error(`Built manifest is missing ${label}.`);
  }

  for (const size of requiredIconSizes) {
    const relativePath = iconSet[String(size)];
    if (typeof relativePath !== 'string') {
      throw new Error(`${label} is missing the ${size}px icon declaration.`);
    }

    const iconPath = resolve(distDir, relativePath);
    if (!existsSync(iconPath)) {
      throw new Error(`${label} references missing icon: ${relativePath}`);
    }

    const icon = readFileSync(iconPath);
    if (icon.length < 24 || !icon.subarray(0, 8).equals(pngSignature)) {
      throw new Error(`${relativePath} is not a valid PNG file.`);
    }

    const width = icon.readUInt32BE(16);
    const height = icon.readUInt32BE(20);
    if (width !== size || height !== size) {
      throw new Error(`${relativePath} must be ${size}x${size}, received ${width}x${height}.`);
    }
  }
}

validateIconSet(manifest.icons, 'manifest.icons');
validateIconSet(manifest.action?.default_icon, 'manifest.action.default_icon');

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
