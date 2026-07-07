import { create } from 'zustand';
import type { ScanResult } from '../shared/types';

interface ScanStore {
  progress: number;
  result: ScanResult | null;
  lastScanAt: number | null;
  running: boolean;
  error: string | null;
  setProgress: (progress: number) => void;
  setResult: (result: ScanResult, lastScanAt?: number) => void;
  setRunning: (running: boolean) => void;
  setError: (error: string | null) => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  progress: 0,
  result: null,
  lastScanAt: null,
  running: false,
  error: null,
  setProgress: (progress) => set({ progress }),
  setResult: (result, lastScanAt = Date.now()) => set({ result, lastScanAt, error: null }),
  setRunning: (running) => set({ running }),
  setError: (error) => set({ error })
}));
