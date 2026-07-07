import { registerAlarms } from './alarms';
import { registerMessageRouter } from './messageRouter';

chrome.action.onClicked.addListener(() => {
  void chrome.runtime.openOptionsPage();
});

registerMessageRouter();
void registerAlarms();

chrome.runtime.onInstalled.addListener(() => {
  void registerAlarms();
});

chrome.runtime.onStartup.addListener(() => {
  void registerAlarms();
});

export {};
