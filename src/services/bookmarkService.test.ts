import { describe, expect, it } from 'vitest';
import { bookmarkService } from './bookmarkService';

describe('bookmarkService', () => {
  it('creates a nested import tree from item paths in mock mode', async () => {
    const result = await bookmarkService.createMany([
      { title: 'React', url: 'https://react.dev', path: ['Imported', 'Docs'] },
      { title: 'Example', url: 'https://example.com', path: ['Imported'] }
    ]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Imported');
      expect(result.data[0].children?.[0].title).toBe('Docs');
      expect(result.data[0].children?.[1].title).toBe('Example');
    }
  });
});
