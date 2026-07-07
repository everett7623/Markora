import i18n from '../shared/i18n';
import type { Result } from '../shared/types';

export const alarmService = {
  async registerAlarms(): Promise<Result<boolean>> {
    if (!globalThis.chrome?.runtime?.id) return { success: true, data: false };

    try {
      const response = await chrome.runtime.sendMessage({ type: 'register-alarms' });
      if (response?.success === false) return response as Result<boolean>;
      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : i18n.t('serviceErrors.registerAutoScan')
      };
    }
  }
};
