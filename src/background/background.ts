import { registerAlarms } from './alarms';
import { registerMessageRouter } from './messageRouter';
import { clearAvailableExtensionUpdate, registerExtensionUpdateLifecycle } from './updateLifecycle';

chrome.action.onClicked.addListener(() => {
  void chrome.runtime.openOptionsPage();
});

registerMessageRouter();
registerExtensionUpdateLifecycle();
void registerAlarms();

chrome.runtime.onInstalled.addListener((details) => {
  void registerAlarms();
  if (details.reason === 'update') void clearAvailableExtensionUpdate();
});

chrome.runtime.onStartup.addListener(() => {
  void registerAlarms();
});

export {};
