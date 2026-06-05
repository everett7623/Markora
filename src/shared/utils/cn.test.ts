import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('merges Tailwind class conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
