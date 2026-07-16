import { registerAlarms } from './alarms';
import { linkRequestService } from '../services/linkRequestService';
import type { LinkFetchRequest, Result } from '../shared/types';

export type BackgroundMessage =
  | { type: 'open-options' }
  | { type: 'register-alarms' }
  | { type: 'apply-extension-update' }
  | LinkFetchRequest;

export function registerMessageRouter(): void {
  chrome.runtime.onMessage.addListener((message: BackgroundMessage, _sender, sendResponse) => {
    if (message.type === 'open-options') {
      void chrome.runtime.openOptionsPage();
      return;
    }

    if (message.type === 'register-alarms') {
      void registerAlarms()
        .then(() => sendResponse({ success: true, data: true } satisfies Result<boolean>))
        .catch((error) =>
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : 'Unable to register alarms.'
          } satisfies Result<boolean>)
        );
      return true;
    }

    if (message.type === 'apply-extension-update') {
      sendResponse({ success: true, data: true } satisfies Result<boolean>);
      setTimeout(() => chrome.runtime.reload(), 50);
      return;
    }

    if (message.type === 'check-link') {
      void linkRequestService.check(message.url, message.settings).then(sendResponse);
      return true;
    }
  });
}
