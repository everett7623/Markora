import { RotateCcw, Save, Settings, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { flattenBookmarks } from '../../shared/utils/bookmarks';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import type { AppSettings, Language, ScannerConfig, Theme } from '../../shared/types';
import { useSettingsStore } from '../../stores/settingsStore';

type NumberSettingKey = 'cacheHours' | 'backupRetention';
type ScannerNumberKey = keyof ScannerConfig;

export default function SettingsPage() {
  const { t } = useTranslation();
  const settings = useSettingsStore((state) => state.settings);
  const loading = useSettingsStore((state) => state.loading);
  const error = useSettingsStore((state) => state.error);
  const update = useSettingsStore((state) => state.update);
  const updateScanner = useSettingsStore((state) => state.updateScanner);
  const backups = useBookmarkStore((state) => state.backups);
  const mutating = useBookmarkStore((state) => state.mutating);
  const loadBackups = useBookmarkStore((state) => state.loadBackups);
  const restoreBackup = useBookmarkStore((state) => state.restoreBackup);
  const deleteBackup = useBookmarkStore((state) => state.deleteBackup);

  useEffect(() => {
    void loadBackups();
  }, [loadBackups]);

  const updateSetting = (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
    void update({ [key]: value });
  };

  const updateNumberSetting = (key: NumberSettingKey, value: string) => {
    void update({ [key]: Number(value) });
  };

  const updateScannerNumber = (key: ScannerNumberKey, value: string) => {
    void updateScanner({ [key]: Number(value) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
          <Settings size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold">{t('pages.settings.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('pages.settings.description')}</p>
        </div>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 lg:grid-cols-2">
        <SettingsCard title={t('settings.appearance')}>
          <SelectField
            label={t('settings.theme')}
            value={settings.theme}
            disabled={loading}
            options={[
              { value: 'system', label: t('settings.themeOptions.system') },
              { value: 'light', label: t('settings.themeOptions.light') },
              { value: 'dark', label: t('settings.themeOptions.dark') }
            ]}
            onChange={(value) => updateSetting('theme', value as Theme)}
          />
          <SelectField
            label={t('settings.language')}
            value={settings.language}
            disabled={loading}
            options={[
              { value: 'en', label: 'English' },
              { value: 'zh_CN', label: '中文' }
            ]}
            onChange={(value) => updateSetting('language', value as Language)}
          />
        </SettingsCard>

        <SettingsCard title={t('settings.scanner')}>
          <NumberField
            label={t('settings.timeoutMs')}
            min={1000}
            max={60000}
            step={1000}
            value={settings.scanner.timeoutMs}
            disabled={loading}
            onChange={(value) => updateScannerNumber('timeoutMs', value)}
          />
          <NumberField
            label={t('settings.concurrency')}
            min={1}
            max={12}
            value={settings.scanner.concurrency}
            disabled={loading}
            onChange={(value) => updateScannerNumber('concurrency', value)}
          />
          <NumberField
            label={t('settings.retryCount')}
            min={0}
            max={5}
            value={settings.scanner.retryCount}
            disabled={loading}
            onChange={(value) => updateScannerNumber('retryCount', value)}
          />
        </SettingsCard>

        <SettingsCard title={t('settings.cache')}>
          <NumberField
            label={t('settings.cacheHours')}
            min={1}
            max={168}
            value={settings.cacheHours}
            disabled={loading}
            onChange={(value) => updateNumberSetting('cacheHours', value)}
          />
        </SettingsCard>

        <SettingsCard title={t('settings.backup')}>
          <NumberField
            label={t('settings.backupRetention')}
            min={1}
            max={50}
            value={settings.backupRetention}
            disabled={loading}
            onChange={(value) => updateNumberSetting('backupRetention', value)}
          />
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">{t('settings.backupManagement', { defaultValue: 'Backup management' })}</h3>
              <p className="mt-1 text-xs text-slate-500">
                {backups.length === 0
                  ? t('settings.noBackups', { defaultValue: 'Backups will appear after delete, import, or restore operations.' })
                  : t('settings.backupCount', { count: backups.length, defaultValue: `${backups.length} backups available.` })}
              </p>
            </div>
            <div className="max-h-72 space-y-2 overflow-auto pr-1">
              {backups.map((backup) => (
                <div key={backup.id} className="rounded-md border p-3 text-sm dark:border-slate-800">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-medium capitalize">{backup.reason}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {new Date(backup.createdAt).toLocaleString()} · {flattenBookmarks(backup.bookmarks).length.toLocaleString()} bookmarks
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void restoreBackup(backup.id)}
                        disabled={mutating}
                        className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-slate-900"
                      >
                        <RotateCcw size={13} />
                        {t('settings.restoreBackup', { defaultValue: 'Restore' })}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteBackup(backup.id)}
                        disabled={mutating}
                        className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={13} />
                        {t('settings.deleteBackup', { defaultValue: 'Delete' })}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SettingsCard>
      </section>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Save size={16} />
        {t('settings.autoSave')}
      </div>
    </div>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-lg border bg-white p-5 shadow-sm dark:bg-slate-950">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  disabled,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
      />
    </label>
  );
}
