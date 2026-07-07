import { bookmarkService } from '../services/bookmarkService';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS } from '../shared/constants/storage';
import type { AppSettings, ScanCache } from '../shared/types';
import { createStructureScanResult } from '../shared/utils/structureScan';

const AUTO_SCAN_ALARM_NAME = 'markora-auto-scan';
const AUTO_SCAN_PERIOD_MINUTES = 24 * 60;
let alarmListenerRegistered = false;

async function isAutoScanEnabled(): Promise<boolean> {
  const stored = await storageService.get<AppSettings>(STORAGE_KEYS.settings);
  return stored.success && stored.data?.data.autoScan === true;
}

async function runAutoScan(): Promise<void> {
  const tree = await bookmarkService.getTree();
  if (!tree.success) return;
  const cache: ScanCache = { result: createStructureScanResult(tree.data), createdAt: Date.now() };
  await storageService.set(STORAGE_KEYS.scanCache, cache);
}

function ensureAlarmListener(): void {
  if (alarmListenerRegistered || !chrome.alarms) return;

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== AUTO_SCAN_ALARM_NAME) return;
    void runAutoScan();
  });
  alarmListenerRegistered = true;
}

export async function registerAlarms(): Promise<void> {
  ensureAlarmListener();
  if (!chrome.alarms) return;

  if (await isAutoScanEnabled()) {
    await chrome.alarms.create(AUTO_SCAN_ALARM_NAME, { periodInMinutes: AUTO_SCAN_PERIOD_MINUTES });
    return;
  }

  await chrome.alarms.clear(AUTO_SCAN_ALARM_NAME);
}
