import { create } from 'zustand';
import type { ScanResult } from '../shared/types';

interface ScanStore {
  progress: number;
  result: ScanResult | null;
  running: boolean;
  setProgress: (progress: number) => void;
  setResult: (result: ScanResult) => void;
  setRunning: (running: boolean) => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  progress: 0,
  result: null,
  running: false,
  setProgress: (progress) => set({ progress }),
  setResult: (result) => set({ result }),
  setRunning: (running) => set({ running })
}));
