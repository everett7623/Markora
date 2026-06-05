export function registerAlarms(): void {
  chrome.alarms?.onAlarm.addListener(() => {
    // Reserved for cache and backup maintenance.
  });
}
