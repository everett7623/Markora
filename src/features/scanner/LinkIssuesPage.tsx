import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Edit3, ExternalLink, Trash2, WifiOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { scanService } from '../../services/scanService';
import { Button } from '../../shared/components/ui/Button';
import type { InvalidLink } from '../../shared/types';
import { normalizeLinkIssue } from '../../shared/utils/linkCheck';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { useScanStore } from '../../stores/scanStore';

const PAGE_SIZE = 50;
type IssueFilter = 'all' | 'broken' | 'unreachable';

export default function LinkIssuesPage() {
  const { t } = useTranslation();
  const result = useScanStore((state) => state.result);
  const setResult = useScanStore((state) => state.setResult);
  const deleteBookmarks = useBookmarkStore((state) => state.deleteBookmarks);
  const updateBookmarkUrl = useBookmarkStore((state) => state.updateBookmarkUrl);
  const mutating = useBookmarkStore((state) => state.mutating);
  const mutationError = useBookmarkStore((state) => state.error);
  const [filter, setFilter] = useState<IssueFilter>('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (result) return;
    void scanService.getCached().then((cached) => {
      if (cached.success && cached.data) setResult(cached.data);
    });
  }, [result, setResult]);

  const issues = useMemo(() => (result?.invalidLinks ?? []).map(normalizeLinkIssue), [result]);
  const filteredIssues = useMemo(() => issues.filter((issue) => filter === 'all' || issue.kind === filter), [filter, issues]);
  const pageCount = Math.max(1, Math.ceil(filteredIssues.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageIssues = filteredIssues.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const brokenCount = issues.filter((issue) => issue.kind === 'broken').length;
  const unreachableCount = issues.length - brokenCount;

  const changeFilter = (nextFilter: IssueFilter) => {
    setFilter(nextFilter);
    setPage(1);
    setSelectedIds(new Set());
  };

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const deleteSelected = async () => {
    const ids = [...selectedIds];
    if (!result || ids.length === 0) return;
    await deleteBookmarks(ids);
    if (useBookmarkStore.getState().error) return;

    const nextResult = {
      ...result,
      invalidLinks: result.invalidLinks.filter((issue) => !selectedIds.has(issue.node.id))
    };
    setResult(nextResult);
    setSelectedIds(new Set());
    await scanService.saveCache(nextResult);
  };

  const removeIssue = async (id: string) => {
    if (!result) return;
    const nextResult = { ...result, invalidLinks: result.invalidLinks.filter((issue) => issue.node.id !== id) };
    setResult(nextResult);
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    await scanService.saveCache(nextResult);
  };

  const editIssueUrl = async (issue: InvalidLink) => {
    const nextUrl = window.prompt(t('linkIssues.editPrompt'), issue.node.url);
    if (nextUrl === null || nextUrl.trim() === issue.node.url) return;
    await updateBookmarkUrl(issue.node.id, nextUrl);
    if (!useBookmarkStore.getState().error) await removeIssue(issue.node.id);
  };

  const deleteIssue = async (issue: InvalidLink) => {
    if (!window.confirm(t('linkIssues.deleteConfirm', { title: issue.node.title || issue.node.url }))) return;
    await deleteBookmarks([issue.node.id]);
    if (!useBookmarkStore.getState().error) await removeIssue(issue.node.id);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/scanner" className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
            <ArrowLeft size={15} />
            {t('linkIssues.back')}
          </Link>
          <h1 className="text-2xl font-semibold">{t('linkIssues.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('linkIssues.description')}</p>
        </div>
        <Button variant="outline" disabled={selectedIds.size === 0 || mutating} onClick={() => void deleteSelected()}>
          <Trash2 size={16} />
          {t('linkIssues.deleteSelected', { count: selectedIds.size })}
        </Button>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
        <div className="flex items-start gap-2">
          <WifiOff className="mt-0.5 shrink-0" size={17} />
          <p>{t('linkIssues.proxyNotice')}</p>
        </div>
      </div>

      {mutationError && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{mutationError}</div>}

      <div className="flex flex-wrap gap-2">
        <FilterButton active={filter === 'all'} onClick={() => changeFilter('all')} label={t('linkIssues.all')} count={issues.length} />
        <FilterButton active={filter === 'broken'} onClick={() => changeFilter('broken')} label={t('linkIssues.broken')} count={brokenCount} />
        <FilterButton active={filter === 'unreachable'} onClick={() => changeFilter('unreachable')} label={t('linkIssues.unreachable')} count={unreachableCount} />
        <Button
          variant="outline"
          onClick={() => setSelectedIds((current) => new Set([...current, ...pageIssues.map((issue) => issue.node.id)]))}
          disabled={pageIssues.length === 0}
        >
          {t('linkIssues.selectPage')}
        </Button>
        <Button variant="ghost" onClick={() => setSelectedIds(new Set())} disabled={selectedIds.size === 0}>
          {t('linkIssues.clearSelection')}
        </Button>
      </div>

      <section className="overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-slate-950">
        {pageIssues.length > 0 ? (
          <div className="divide-y dark:divide-slate-800">
            {pageIssues.map((issue) => (
              <IssueRow
                key={issue.node.id}
                issue={issue}
                selected={selectedIds.has(issue.node.id)}
                disabled={mutating}
                onSelectedChange={toggleSelected}
                onEdit={editIssueUrl}
                onDelete={deleteIssue}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">{t('linkIssues.noResults')}</div>
        )}
      </section>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{t('linkIssues.range', { from: pageIssues.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0, to: (currentPage - 1) * PAGE_SIZE + pageIssues.length, total: filteredIssues.length })}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label={t('linkIssues.previous')}>
            <ChevronLeft size={16} />
          </Button>
          <span>{currentPage} / {pageCount}</span>
          <Button variant="outline" size="icon" disabled={currentPage >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label={t('linkIssues.next')}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-full border px-3 py-1.5 text-sm ${active ? 'border-indigo-600 bg-indigo-600 text-white' : 'bg-white dark:bg-slate-950'}`}>
      {label} ({count})
    </button>
  );
}

function IssueRow({
  issue,
  selected,
  disabled,
  onSelectedChange,
  onEdit,
  onDelete
}: {
  issue: InvalidLink;
  selected: boolean;
  disabled: boolean;
  onSelectedChange: (id: string, checked: boolean) => void;
  onEdit: (issue: InvalidLink) => void;
  onDelete: (issue: InvalidLink) => void;
}) {
  const { t } = useTranslation();
  const isBroken = issue.kind === 'broken';
  return (
    <div className="grid gap-3 p-4 md:grid-cols-[32px_minmax(0,1fr)_180px_300px] md:items-center">
      <input type="checkbox" checked={selected} onChange={(event) => onSelectedChange(issue.node.id, event.target.checked)} aria-label={t('linkIssues.select', { title: issue.node.title || issue.node.url })} />
      <div className="min-w-0">
        <div className="truncate font-medium">{issue.node.title || issue.node.url}</div>
        <div className="mt-1 truncate text-xs text-slate-500">{issue.node.url}</div>
        <div className="mt-1 truncate text-xs text-slate-500">{issue.node.path?.slice(0, -1).join(' / ')}</div>
      </div>
      <div>
        <div className={`inline-flex items-center gap-1 text-sm font-medium ${isBroken ? 'text-red-600' : 'text-amber-600'}`}>
          <AlertTriangle size={14} />
          {isBroken ? t('linkIssues.broken') : t('linkIssues.unreachable')}
        </div>
        <div className="mt-1 text-xs text-slate-500">{t(`linkIssues.reasons.${issue.reason}`)}{issue.status ? ` (HTTP ${issue.status})` : ''}</div>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <a href={issue.node.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900">
          <ExternalLink size={14} />
          {t('linkIssues.open')}
        </a>
        <button type="button" disabled={disabled} onClick={() => onEdit(issue)} className="inline-flex items-center justify-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-slate-900">
          <Edit3 size={14} />
          {t('linkIssues.editUrl')}
        </button>
        <button type="button" disabled={disabled} onClick={() => onDelete(issue)} className="inline-flex items-center justify-center gap-1 rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10">
          <Trash2 size={14} />
          {t('linkIssues.deleteOne')}
        </button>
      </div>
    </div>
  );
}
