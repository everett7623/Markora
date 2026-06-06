import { describe, expect, it } from 'vitest';
import {
  classifyLinkResponse,
  classifyLinkStatus,
  groupBookmarksByUrl,
  interleaveUrlGroupsByHostname,
  isInsecureHttpUrl,
  isProtectedBrowserStoreUrl,
  isConfirmedBrokenResponse,
  normalizeLinkIssue,
  shouldVerifyWithGet
} from './linkCheck';

describe('link check response classification', () => {
  it('verifies every failed HEAD response with GET', () => {
    expect(shouldVerifyWithGet(404)).toBe(true);
    expect(shouldVerifyWithGet(403)).toBe(true);
    expect(shouldVerifyWithGet(200)).toBe(false);
  });

  it('does not classify protected or rate-limited pages as broken', () => {
    expect(isConfirmedBrokenResponse(new Response(null, { status: 401 }))).toBe(false);
    expect(isConfirmedBrokenResponse(new Response(null, { status: 403 }))).toBe(false);
    expect(isConfirmedBrokenResponse(new Response(null, { status: 429 }))).toBe(false);
  });

  it('does not classify Cloudflare challenges as broken', () => {
    const response = new Response(null, {
      status: 503,
      headers: { server: 'cloudflare', 'cf-ray': 'test-ray' }
    });

    expect(isConfirmedBrokenResponse(response)).toBe(false);
    expect(classifyLinkStatus(403, true)).toBeNull();
  });

  it('identifies insecure HTTP links before any automatic request is made', () => {
    expect(isInsecureHttpUrl('http://example.com')).toBe(true);
    expect(isInsecureHttpUrl('https://example.com')).toBe(false);
  });

  it('identifies protected browser store links before any automatic request is made', () => {
    expect(isProtectedBrowserStoreUrl('https://chrome.google.com/webstore/detail/example/id')).toBe(true);
    expect(isProtectedBrowserStoreUrl('https://chromewebstore.google.com/detail/example/id')).toBe(true);
    expect(isProtectedBrowserStoreUrl('https://microsoftedge.microsoft.com/addons/detail/example/id')).toBe(true);
    expect(isProtectedBrowserStoreUrl('https://chrome.google.com/docs')).toBe(false);
    expect(isProtectedBrowserStoreUrl('https://example.com')).toBe(false);
  });

  it('still reports confirmed missing pages and server failures', () => {
    expect(isConfirmedBrokenResponse(new Response(null, { status: 404 }))).toBe(true);
    expect(isConfirmedBrokenResponse(new Response(null, { status: 500 }))).toBe(false);
    expect(classifyLinkResponse(new Response(null, { status: 500 }))).toEqual({ kind: 'unreachable', reason: 'server-error' });
  });

  it('normalizes legacy cached network failures as unverified issues', () => {
    const issue = normalizeLinkIssue({
      node: { id: '1', title: 'Restricted', url: 'https://restricted.test' },
      error: 'Failed to fetch'
    });

    expect(issue.kind).toBe('unreachable');
    expect(issue.reason).toBe('network');
  });

  it('checks each exact URL once while preserving all matching bookmarks', () => {
    const groups = groupBookmarksByUrl([
      { id: '1', title: 'A', url: 'https://example.com/page' },
      { id: '2', title: 'A duplicate', url: 'https://example.com/page' },
      { id: '3', title: 'B', url: 'https://other.test' }
    ]);

    expect(groups).toHaveLength(2);
    expect(groups.find((group) => group.url === 'https://example.com/page')?.bookmarks).toHaveLength(2);
  });

  it('interleaves hosts to avoid bursts against one domain', () => {
    const groups = groupBookmarksByUrl([
      { id: '1', title: 'A1', url: 'https://a.test/1' },
      { id: '2', title: 'A2', url: 'https://a.test/2' },
      { id: '3', title: 'B1', url: 'https://b.test/1' },
      { id: '4', title: 'B2', url: 'https://b.test/2' }
    ]);

    expect(interleaveUrlGroupsByHostname(groups).map((group) => group.hostname)).toEqual(['a.test', 'b.test', 'a.test', 'b.test']);
  });

  it('reduces a 10,000-bookmark collection to unique URL checks', () => {
    const bookmarks = Array.from({ length: 10_000 }, (_, index) => ({
      id: String(index),
      title: `Bookmark ${index}`,
      url: `https://host-${index % 100}.test/page-${index % 2_500}`
    }));
    const groups = groupBookmarksByUrl(bookmarks);

    expect(groups).toHaveLength(2_500);
    expect(groups.reduce((total, group) => total + group.bookmarks.length, 0)).toBe(10_000);
  });
});
