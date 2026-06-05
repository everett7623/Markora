import { describe, expect, it } from 'vitest';
import { exportService } from './exportService';

describe('exportService', () => {
  it('serializes bookmark data as JSON', () => {
    const result = exportService.toJson([{ id: '1', title: 'Example', url: 'https://example.com' }]);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toContain('https://example.com');
  });
});
