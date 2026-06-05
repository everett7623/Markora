import { Bookmark, Folder, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BookmarkNode } from '../../shared/types';
import { Button } from '../../shared/components/ui/Button';
import { useVirtualList } from '../../shared/hooks/useVirtualList';
import { cn } from '../../shared/utils/cn';
import { flattenFolders, getFolderDescendantBookmarks } from '../../shared/utils/bookmarks';
import { useBookmarkStore } from '../../stores/bookmarkStore';

const rowHeight = 56;
const viewportHeight = 620;

export default function ManagerPage() {
  const { t } = useTranslation();
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const searchQuery = useBookmarkStore((state) => state.searchQuery);
  const searchResults = useBookmarkStore((state) => state.searchResults);
  const mutating = useBookmarkStore((state) => state.mutating);
  const deleteBookmarks = useBookmarkStore((state) => state.deleteBookmarks);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const folders = useMemo(() => flattenFolders(bookmarks), [bookmarks]);
  const visibleBookmarks = useMemo(
    () => (searchQuery.trim() ? searchResults : getFolderDescendantBookmarks(bookmarks, selectedFolderId)),
    [bookmarks, searchQuery, searchResults, selectedFolderId]
  );
  const { virtualItems, totalHeight, setScrollTop } = useVirtualList(visibleBookmarks, rowHeight, viewportHeight);
  const selectedCount = selectedIds.size;

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const deleteSelected = async () => {
    await deleteBookmarks([...selectedIds]);
    setSelectedIds(new Set());
  };

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <section className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-950">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">{t('pages.manager.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('pages.manager.description')}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedFolderId(null);
            setSelectedIds(new Set());
          }}
          className={cn(
            'mb-2 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm',
            selectedFolderId === null ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200' : 'hover:bg-slate-100 dark:hover:bg-slate-900'
          )}
        >
          <span className="flex items-center gap-2"><Bookmark size={16} />{t('manager.allBookmarks')}</span>
          <span>{getFolderDescendantBookmarks(bookmarks, null).length}</span>
        </button>
        <div className="max-h-[560px] space-y-1 overflow-auto pr-1">
          {folders.map((folder) => (
            <FolderButton
              key={folder.id}
              folder={folder}
              selected={selectedFolderId === folder.id}
              count={getFolderDescendantBookmarks(bookmarks, folder.id).length}
              onClick={() => {
                setSelectedFolderId(folder.id);
                setSelectedIds(new Set());
              }}
            />
          ))}
        </div>
      </section>

      <section className="flex min-h-0 flex-col rounded-lg border bg-white shadow-sm dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <div>
            <h2 className="font-semibold">{t('manager.bookmarkList')}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {visibleBookmarks.length.toLocaleString()} {t('manager.visibleItems')}
            </p>
          </div>
          <Button variant="outline" onClick={() => void deleteSelected()} disabled={selectedCount === 0 || mutating}>
            <Trash2 size={16} />
            {t('manager.deleteSelected')} {selectedCount > 0 ? `(${selectedCount})` : ''}
          </Button>
        </div>

        <div className="grid h-10 grid-cols-[44px_minmax(180px,1fr)_minmax(240px,1.4fr)_minmax(160px,0.8fr)] items-center border-b px-4 text-xs font-semibold uppercase text-slate-500">
          <span />
          <span>{t('manager.columns.title')}</span>
          <span>{t('manager.columns.url')}</span>
          <span>{t('manager.columns.folder')}</span>
        </div>

        <div className="relative overflow-auto" style={{ height: viewportHeight }} onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}>
          <div style={{ height: totalHeight }}>
            {virtualItems.map(({ item, offsetTop }) => (
              <BookmarkRow key={item.id} bookmark={item} selected={selectedIds.has(item.id)} offsetTop={offsetTop} onSelectedChange={toggleSelected} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FolderButton({ folder, selected, count, onClick }: { folder: BookmarkNode; selected: boolean; count: number; onClick: () => void }) {
  const depth = Math.max(0, (folder.path?.length ?? 1) - 1);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-md py-2 pr-3 text-left text-sm',
        selected ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200' : 'hover:bg-slate-100 dark:hover:bg-slate-900'
      )}
      style={{ paddingLeft: 12 + depth * 14 }}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Folder size={16} className="shrink-0" />
        <span className="truncate">{folder.title || 'Untitled'}</span>
      </span>
      <span className="ml-2 text-xs text-slate-500">{count}</span>
    </button>
  );
}

function BookmarkRow({
  bookmark,
  selected,
  offsetTop,
  onSelectedChange
}: {
  bookmark: BookmarkNode;
  selected: boolean;
  offsetTop: number;
  onSelectedChange: (id: string, checked: boolean) => void;
}) {
  return (
    <div
      className="absolute grid w-full grid-cols-[44px_minmax(180px,1fr)_minmax(240px,1.4fr)_minmax(160px,0.8fr)] items-center gap-2 border-b px-4 text-sm dark:border-slate-800"
      style={{ height: rowHeight, transform: `translateY(${offsetTop}px)` }}
    >
      <input type="checkbox" checked={selected} onChange={(event) => onSelectedChange(bookmark.id, event.target.checked)} aria-label={`Select ${bookmark.title}`} />
      <span className="min-w-0 truncate font-medium">{bookmark.title || 'Untitled'}</span>
      <a href={bookmark.url} target="_blank" rel="noreferrer" className="min-w-0 truncate text-slate-500 hover:text-indigo-600">
        {bookmark.url}
      </a>
      <span className="min-w-0 truncate text-xs text-slate-500">{bookmark.path?.slice(0, -1).join(' / ')}</span>
    </div>
  );
}
