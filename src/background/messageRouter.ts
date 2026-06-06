import { linkRequestService } from '../services/linkRequestService';
import type { LinkFetchRequest } from '../shared/types';

export type BackgroundMessage = { type: 'open-options' } | LinkFetchRequest;

export function registerMessageRouter(): void {
  chrome.runtime.onMessage.addListener((message: BackgroundMessage, _sender, sendResponse) => {
    if (message.type === 'open-options') {
      void chrome.runtime.openOptionsPage();
      return;
    }

    if (message.type === 'check-link') {
      void linkRequestService.check(message.url, message.settings).then(sendResponse);
      return true;
    }
  });
}
