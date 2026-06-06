import type { InvalidLink } from '../types';
import type { BookmarkNode } from '../types';

const RESTRICTED_STATUSES = new Set([401, 403, 407, 429]);
const CLOUDFLARE_CHALLENGE_STATUSES = new Set([403, 429, 503]);
const PROTECTED_BROWSER_STORE_HOSTS = new Set([
  'chrome.google.com',
  'chromewebstore.google.com',
  'microsoftedge.microsoft.com'
]);

export type LinkResponseClassification =
  | { kind: 'broken'; reason: 'not-found' | 'http-error' }
  | { kind: 'unreachable'; reason: 'server-error' }
  | null;
type LinkIssueInput = Omit<InvalidLink, 'kind' | 'reason'> & Partial<Pick<InvalidLink, 'kind' | 'reason'>>;

export interface BookmarkUrlGroup {
  url: string;
  hostname: string;
  bookmarks: BookmarkNode[];
}

export function groupBookmarksByUrl(bookmarks: BookmarkNode[]): BookmarkUrlGroup[] {
  const groups = new Map<string, BookmarkUrlGroup>();

  for (const bookmark of bookmarks) {
    if (!bookmark.url || !/^https?:\/\//i.test(bookmark.url)) continue;
    const existing = groups.get(bookmark.url);
    if (existing) {
      existing.bookmarks.push(bookmark);
      continue;
    }

    let hostname = bookmark.url;
    try {
      hostname = new URL(bookmark.url).hostname;
    } catch {
      // URL shape is validated before this point; retain the URL as a stable fallback key.
    }
    groups.set(bookmark.url, { url: bookmark.url, hostname, bookmarks: [bookmark] });
  }

  return [...groups.values()];
}

export function interleaveUrlGroupsByHostname(groups: BookmarkUrlGroup[]): BookmarkUrlGroup[] {
  const byHostname = new Map<string, BookmarkUrlGroup[]>();
  for (const group of groups) {
    byHostname.set(group.hostname, [...(byHostname.get(group.hostname) ?? []), group]);
  }

  const queues = [...byHostname.values()];
  const interleaved: BookmarkUrlGroup[] = [];
  while (interleaved.length < groups.length) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next) interleaved.push(next);
    }
  }
  return interleaved;
}

export function shouldVerifyWithGet(status: number): boolean {
  return status >= 400;
}

export function isInsecureHttpUrl(url: string): boolean {
  return /^http:\/\//i.test(url);
}

export function isProtectedBrowserStoreUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'chrome.google.com') return parsed.pathname === '/webstore' || parsed.pathname.startsWith('/webstore/');
    if (parsed.hostname === 'microsoftedge.microsoft.com') {
      return parsed.pathname === '/addons' || parsed.pathname.startsWith('/addons/');
    }
    return PROTECTED_BROWSER_STORE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export function classifyLinkStatus(status: number, cloudflare = false): LinkResponseClassification {
  if (status < 400) return null;
  if (RESTRICTED_STATUSES.has(status)) return null;
  if (cloudflare && CLOUDFLARE_CHALLENGE_STATUSES.has(status)) return null;

  if (status === 404 || status === 410) {
    return { kind: 'broken', reason: 'not-found' };
  }
  if (status >= 500) {
    return { kind: 'unreachable', reason: 'server-error' };
  }

  return { kind: 'broken', reason: 'http-error' };
}

export function classifyLinkResponse(response: Response): LinkResponseClassification {
  const isCloudflare = response.headers.has('cf-ray') || response.headers.get('server')?.toLowerCase().includes('cloudflare');
  return classifyLinkStatus(response.status, isCloudflare);
}

export function isConfirmedBrokenResponse(response: Response): boolean {
  return classifyLinkResponse(response)?.kind === 'broken';
}

export function normalizeLinkIssue(issue: LinkIssueInput): InvalidLink {
  if (issue.kind && issue.reason) return { ...issue, kind: issue.kind, reason: issue.reason };
  if (issue.status === 404 || issue.status === 410) {
    return { ...issue, kind: 'broken', reason: 'not-found' };
  }
  if (issue.status && issue.status >= 500) {
    return { ...issue, kind: 'unreachable', reason: 'server-error' };
  }
  if (!issue.status) {
    return {
      ...issue,
      kind: 'unreachable',
      reason: issue.error.toLowerCase().includes('timeout') ? 'timeout' : 'network'
    };
  }
  return { ...issue, kind: 'broken', reason: 'http-error' };
}
