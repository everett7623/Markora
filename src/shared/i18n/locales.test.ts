import { describe, expect, it } from 'vitest';
import { en } from './locales/en';
import { zhCN } from './locales/zh-CN';

function collectKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix];

  return Object.entries(value).flatMap(([key, child]) => collectKeys(child, prefix ? `${prefix}.${key}` : key));
}

describe('locale resources', () => {
  it('keeps English and Chinese locale keys in parity', () => {
    expect(collectKeys(zhCN).sort()).toEqual(collectKeys(en).sort());
  });
});
