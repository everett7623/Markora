export type BackgroundMessage = { type: 'open-options' };

export function registerMessageRouter(): void {
  chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.type === 'open-options') void chrome.runtime.openOptionsPage();
  });
}
