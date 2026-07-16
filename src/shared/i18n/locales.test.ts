import { describe, expect, it } from 'vitest';
import { enResources as en, zhCNResources as zhCN } from './locales/resources';

function collectKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix];

  return Object.entries(value).flatMap(([key, child]) => collectKeys(child, prefix ? `${prefix}.${key}` : key));
}

describe('locale resources', () => {
  it('keeps English and Chinese locale keys in parity', () => {
    expect(collectKeys(zhCN).sort()).toEqual(collectKeys(en).sort());
  });

  it('localizes release status labels', () => {
    expect(en.status).toEqual({ loading: 'Loading...', beta: 'Beta' });
    expect(zhCN.status).toEqual({ loading: '加载中...', beta: '测试版' });
  });
});
