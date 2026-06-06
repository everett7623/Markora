import type {
  BookmarkNode,
  InvalidLink,
  LinkCheckWorkerRequest,
  LinkCheckWorkerResponse,
  LinkFetchResponse,
  Result,
  ScannerConfig
} from '../shared/types';
import {
  classifyLinkStatus,
  groupBookmarksByUrl,
  interleaveUrlGroupsByHostname,
  isInsecureHttpUrl,
  isProtectedBrowserStoreUrl
} from '../shared/utils/linkCheck';

function isCheckableUrl(url: string | undefined): url is string {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
}

let nextRequestId = 0;
const pendingRequests = new Map<number, (result: Result<LinkFetchResponse>) => void>();

function requestLink(url: string, settings: ScannerConfig): Promise<Result<LinkFetchResponse>> {
  const requestId = nextRequestId;
  nextRequestId += 1;

  return new Promise((resolve) => {
    pendingRequests.set(requestId, resolve);
    self.postMessage({
      type: 'request-link',
      progress: 0,
      requestId,
      request: { type: 'check-link', url, settings }
    } satisfies LinkCheckWorkerResponse);
  });
}

async function checkLink(node: BookmarkNode, settings: ScannerConfig): Promise<InvalidLink | null> {
  if (!isCheckableUrl(node.url)) return null;
  if (isInsecureHttpUrl(node.url)) {
    return {
      node,
      error: 'Insecure HTTP links require manual verification.',
      kind: 'unreachable',
      reason: 'insecure'
    };
  }
  if (isProtectedBrowserStoreUrl(node.url)) {
    return {
      node,
      error: 'Browser store links require manual verification.',
      kind: 'unreachable',
      reason: 'protected'
    };
  }

  const result = await requestLink(node.url, settings);
  if (!result.success) {
    return { node, error: result.error, kind: 'unreachable', reason: 'network' };
  }

  if (result.data.failure) {
    return {
      node,
      error: result.data.error ?? 'Network error',
      kind: 'unreachable',
      reason: result.data.failure
    };
  }

  const status = result.data.status ?? 0;
  const classification = classifyLinkStatus(status, result.data.cloudflare);
  if (!classification) return null;
  return {
    node,
    status,
    error: result.data.statusText || `HTTP ${status}`,
    ...classification
  };
}

async function checkLinks(bookmarks: BookmarkNode[], settings: ScannerConfig): Promise<InvalidLink[]> {
  const checkable = bookmarks.filter((bookmark) => isCheckableUrl(bookmark.url));
  const pending = interleaveUrlGroupsByHostname(groupBookmarksByUrl(checkable));
  const uniqueUrls = pending.length;
  const invalidLinks: InvalidLink[] = [];
  const concurrency = Math.max(1, Math.min(settings.concurrency, 12));
  const activeByHostname = new Map<string, number>();
  let active = 0;
  let completed = 0;

  await new Promise<void>((resolve) => {
    const schedule = () => {
      while (active < concurrency && pending.length > 0) {
        const nextIndex = pending.findIndex((group) => (activeByHostname.get(group.hostname) ?? 0) < 2);
        if (nextIndex < 0) break;

        const [current] = pending.splice(nextIndex, 1);
        active += 1;
        activeByHostname.set(current.hostname, (activeByHostname.get(current.hostname) ?? 0) + 1);

        void checkLink(current.bookmarks[0], settings).then((result) => {
          if (result) {
            invalidLinks.push(...current.bookmarks.map((node) => ({ ...result, node })));
          }
        }).finally(() => {
          active -= 1;
          activeByHostname.set(current.hostname, Math.max(0, (activeByHostname.get(current.hostname) ?? 1) - 1));
          completed += current.bookmarks.length;
          self.postMessage({
            type: 'progress',
            progress: checkable.length === 0 ? 100 : Math.round((completed / checkable.length) * 100),
            checkedBookmarks: completed,
            totalBookmarks: checkable.length,
            uniqueUrls
          } satisfies LinkCheckWorkerResponse);

          if (pending.length === 0 && active === 0) resolve();
          else schedule();
        });
      }

      if (pending.length === 0 && active === 0) resolve();
    };

    schedule();
  });
  return invalidLinks;
}

self.onmessage = async (event: MessageEvent<LinkCheckWorkerRequest>) => {
  if (event.data.type === 'link-result') {
    pendingRequests.get(event.data.requestId)?.(event.data.result);
    pendingRequests.delete(event.data.requestId);
    return;
  }

  if (event.data.type !== 'check-links') return;

  try {
    const invalidLinks = await checkLinks(event.data.bookmarks, event.data.settings);
    self.postMessage({ type: 'complete', progress: 100, invalidLinks } satisfies LinkCheckWorkerResponse);
  } catch (error) {
    self.postMessage({
      type: 'error',
      progress: 100,
      error: error instanceof Error ? error.message : 'Broken link scan failed.'
    } satisfies LinkCheckWorkerResponse);
  }
};
