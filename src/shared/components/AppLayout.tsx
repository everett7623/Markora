import { BarChart3, FolderTree, Import, Menu, ScanSearch, Settings, Sparkles } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

const navigation = [
  { to: '/', key: 'dashboard', icon: BarChart3 },
  { to: '/scanner', key: 'scanner', icon: ScanSearch },
  { to: '/manager', key: 'manager', icon: FolderTree },
  { to: '/import-export', key: 'importExport', icon: Import },
  { to: '/settings', key: 'settings', icon: Settings }
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-white transition-transform lg:static lg:translate-x-0 dark:bg-slate-950',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <span className="rounded-lg bg-indigo-600 p-2 text-white"><Sparkles size={18} /></span>
          <span className="font-semibold">{t('appName')}</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navigation.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900',
                  isActive && 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200'
                )
              }
            >
              <Icon size={17} />
              {t(`navigation.${key}`)}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6 dark:bg-slate-950">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label={t('actions.menu')}>
            <Menu size={19} />
          </Button>
          <div>
            <div className="text-sm font-semibold">{t('appName')}</div>
            <div className="text-xs text-slate-500">{t('tagline')}</div>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">P0</span>
        </header>
        <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">{children}</main>
        <footer className="flex h-10 items-center justify-between border-t bg-white px-4 text-xs text-slate-500 lg:px-6 dark:bg-slate-950">
          <span>{t('footer.localOnly')}</span>
          <span>v0.1.0</span>
        </footer>
      </div>
    </div>
  );
}
