import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'manifest.json');
const privacyPath = path.join(root, 'PRIVACY.md');
const sourceRoot = path.join(root, 'src');

const expectedRequiredPermissions = new Set(['alarms', 'bookmarks', 'storage']);
const expectedOptionalHostPermissions = ['<all_urls>'];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function collectSourceFiles(dir) {
  if (!existsSync(dir)) return [];

  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) files.push(fullPath);
  }

  return files;
}

const manifest = readJson(manifestPath);
const privacyPolicy = readFileSync(privacyPath, 'utf8');
const permissions = new Set(manifest.permissions ?? []);
const optionalHostPermissions = manifest.optional_host_permissions ?? [];
const source = collectSourceFiles(sourceRoot)
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');

for (const required of expectedRequiredPermissions) {
  if (!permissions.has(required)) {
    throw new Error(`Missing required permission: ${required}`);
  }
}

for (const permission of permissions) {
  if (!expectedRequiredPermissions.has(permission)) {
    throw new Error(`Unexpected required permission: ${permission}`);
  }
}

if (permissions.has('tabs') && !/\bchrome\.tabs\b/.test(source)) {
  throw new Error('The tabs permission is present, but no chrome.tabs API usage was found.');
}

if (
  optionalHostPermissions.length !== expectedOptionalHostPermissions.length ||
  optionalHostPermissions.some((permission, index) => permission !== expectedOptionalHostPermissions[index])
) {
  throw new Error('Optional host permissions must be limited to <all_urls>.');
}

for (const permission of expectedRequiredPermissions) {
  if (!privacyPolicy.includes(`\`${permission}\``)) {
    throw new Error(`PRIVACY.md does not document the ${permission} permission.`);
  }
}

if (privacyPolicy.includes('`tabs`')) {
  throw new Error('PRIVACY.md still documents the removed tabs permission.');
}

if (!privacyPolicy.includes('Optional `<all_urls>` host access')) {
  throw new Error('PRIVACY.md does not document optional <all_urls> host access.');
}

console.log('Permission audit passed: required permissions are alarms, bookmarks, and storage.');
