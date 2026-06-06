import { registerMessageRouter } from './messageRouter';

chrome.action.onClicked.addListener(() => {
  void chrome.runtime.openOptionsPage();
});

registerMessageRouter();

export {};
