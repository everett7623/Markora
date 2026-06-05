import { AlertTriangle, Bookmark, Copy, Folder, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { useScanStore } from '../../stores/scanStore';

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

export default function DashboardPage() {
  const { t } = useTranslation();
  const stats = useBookmarkStore((state) => state.stats);
  const loading = useBookmarkStore((state) => state.loading);
  const error = useBookmarkStore((state) => state.error);
  const recentSearches = useBookmarkStore((state) => state.recentSearches);
  const scanResult = useScanStore((state) => state.result);

  const cards = [
    { label: t('dashboard.cards.bookmarks'), value: stats.totalBookmarks, icon: Bookmark, to: '/manager' },
    { label: t('dashboard.cards.folders'), value: stats.totalFolders, icon: Folder, to: '/manager' },
    { label: t('dashboard.cards.duplicates'), value: stats.duplicateBookmarks, icon: Copy, to: '/scanner' },
    { label: t('dashboard.cards.invalid'), value: scanResult?.invalidLinks.length ?? stats.invalidLinks, icon: AlertTriangle, to: '/scanner' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('pages.dashboard.title')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('pages.dashboard.description')}</p>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="rounded-lg border bg-white p-5 shadow-sm transition hover:border-indigo-300 dark:bg-slate-950">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{label}</span>
              <Icon size={18} className="text-indigo-600" />
            </div>
            <div className="mt-3 text-3xl font-semibold">{loading ? '...' : formatNumber(value)}</div>
          </Link>
        ))}
      </div>

      <section className="rounded-lg border bg-white p-5 shadow-sm dark:bg-slate-950">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-indigo-600" />
          <h2 className="font-semibold">{t('dashboard.searchHistory')}</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {recentSearches.length > 0 ? (
            recentSearches.map((query) => (
              <span key={query} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {query}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500">{t('dashboard.noSearchHistory')}</span>
          )}
        </div>
      </section>
    </div>
  );
}
