import { Bookmark, Edit3, Folder, RotateCcw, Tags, Trash2 } from 'lucide-react';
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
  const renameBookmark = useBookmarkStore((state) => state.renameBookmark);
  const renameFolder = useBookmarkStore((state) => state.renameFolder);
  const moveBookmarks = useBookmarkStore((state) => state.moveBookmarks);
  const moveFolders = useBookmarkStore((state) => state.moveFolders);
  const reorderBookmarkBefore = useBookmarkStore((state) => state.reorderBookmarkBefore);
  const undoLastDelete = useBookmarkStore((state) => state.undoLastDelete);
  const setBookmarkTags = useBookmarkStore((state) => state.setBookmarkTags);
  const tagsByBookmarkId = useBookmarkStore((state) => state.tagsByBookmarkId);
  const tagFilter = useBookmarkStore((state) => state.tagFilter);
  const setTagFilter = useBookmarkStore((state) => state.setTagFilter);
  const canUndoDelete = useBookmarkStore((state) => state.lastDeletedSnapshot !== null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [moveTargetId, setMoveTargetId] = useState('');
  const [draggedIds, setDraggedIds] = useState<string[]>([]);

  const folders = useMemo(() => flattenFolders(bookmarks), [bookmarks]);
  const availableTags = useMemo(() => [...new Set(Object.values(tagsByBookmarkId).flat())].sort((a, b) => a.localeCompare(b)), [tagsByBookmarkId]);
  const visibleBookmarks = useMemo(
    () => (searchQuery.trim() || tagFilter ? searchResults : getFolderDescendantBookmarks(bookmarks, selectedFolderId)),
    [bookmarks, searchQuery, searchResults, selectedFolderId, tagFilter]
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

  const moveSelected = async (targetFolderId = moveTargetId) => {
    if (!targetFolderId || selectedIds.size === 0) return;
    await moveBookmarks([...selectedIds], targetFolderId);
    setSelectedIds(new Set());
  };

  const renameItem = async (bookmark: BookmarkNode) => {
    const title = window.prompt(t('manager.renamePrompt', { defaultValue: 'Rename bookmark' }), bookmark.title || 'Untitled');
    if (title !== null) await renameBookmark(bookmark.id, title);
  };

  const renameFolderItem = async (folder: BookmarkNode) => {
    const title = window.prompt(t('manager.renameFolderPrompt', { defaultValue: 'Rename folder' }), folder.title || 'Untitled');
    if (title !== null) await renameFolder(folder.id, title);
  };

  const editTags = async (bookmark: BookmarkNode) => {
    const value = window.prompt(t('manager.tagsPrompt', { defaultValue: 'Comma-separated tags' }), bookmark.tags?.join(', ') ?? '');
    if (value !== null) await setBookmarkTags(bookmark.id, value.split(','));
  };

  const dropOnFolder = async (folderId: string) => {
    if (draggedIds.length === 0) return;
    await moveFolders(draggedIds, folderId);
    setDraggedIds([]);
    setSelectedIds(new Set());
  };

  const dropBeforeBookmark = async (bookmarkId: string) => {
    const [draggedId] = draggedIds;
    if (!draggedId) return;
    await reorderBookmarkBefore(draggedId, bookmarkId);
    setDraggedIds([]);
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
              onRename={() => void renameFolderItem(folder)}
              onDragStart={() => setDraggedIds([folder.id])}
              onDrop={() => void dropOnFolder(folder.id)}
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
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={tagFilter ?? ''}
              onChange={(event) => setTagFilter(event.target.value || null)}
              className="h-9 rounded-md border bg-white px-2 text-sm dark:bg-slate-950"
              aria-label={t('manager.filterByTag', { defaultValue: 'Filter by tag' })}
            >
              <option value="">{t('manager.allTags', { defaultValue: 'All tags' })}</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <select
              value={moveTargetId}
              onChange={(event) => setMoveTargetId(event.target.value)}
              className="h-9 rounded-md border bg-white px-2 text-sm dark:bg-slate-950"
              aria-label={t('manager.moveTarget', { defaultValue: 'Move target' })}
            >
              <option value="">{t('manager.moveTo', { defaultValue: 'Move to...' })}</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>{folder.path?.join(' / ') || folder.title}</option>
              ))}
            </select>
            <Button variant="outline" onClick={() => void moveSelected()} disabled={selectedCount === 0 || !moveTargetId || mutating}>
              {t('manager.moveSelected', { defaultValue: 'Move selected' })} {selectedCount > 0 ? `(${selectedCount})` : ''}
            </Button>
            <Button variant="outline" onClick={() => void undoLastDelete()} disabled={!canUndoDelete || mutating}>
              <RotateCcw size={16} />
              {t('manager.undo', { defaultValue: 'Undo' })}
            </Button>
            <Button variant="outline" onClick={() => void deleteSelected()} disabled={selectedCount === 0 || mutating}>
              <Trash2 size={16} />
              {t('manager.deleteSelected')} {selectedCount > 0 ? `(${selectedCount})` : ''}
            </Button>
          </div>
        </div>

        <div className="grid h-10 grid-cols-[44px_minmax(180px,1fr)_minmax(220px,1.2fr)_minmax(140px,0.7fr)_120px] items-center border-b px-4 text-xs font-semibold uppercase text-slate-500">
          <span />
          <span>{t('manager.columns.title')}</span>
          <span>{t('manager.columns.url')}</span>
          <span>{t('manager.columns.folder')}</span>
          <span>{t('manager.columns.actions', { defaultValue: 'Actions' })}</span>
        </div>

        <div className="relative overflow-auto" style={{ height: viewportHeight }} onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}>
          <div style={{ height: totalHeight }}>
            {virtualItems.map(({ item, offsetTop }) => (
              <BookmarkRow
                key={item.id}
                bookmark={item}
                selected={selectedIds.has(item.id)}
                offsetTop={offsetTop}
                onSelectedChange={toggleSelected}
                onRename={renameItem}
                onEditTags={editTags}
                onDragStart={(id) => setDraggedIds(selectedIds.has(id) ? [...selectedIds] : [id])}
                onDropBefore={dropBeforeBookmark}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FolderButton({
  folder,
  selected,
  count,
  onClick,
  onRename,
  onDragStart,
  onDrop
}: {
  folder: BookmarkNode;
  selected: boolean;
  count: number;
  onClick: () => void;
  onRename: () => void;
  onDragStart: () => void;
  onDrop: () => void;
}) {
  const depth = Math.max(0, (folder.path?.length ?? 1) - 1);
  return (
    <button
      type="button"
      draggable
      onClick={onClick}
      onDoubleClick={onRename}
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
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
  onSelectedChange,
  onRename,
  onEditTags,
  onDragStart,
  onDropBefore
}: {
  bookmark: BookmarkNode;
  selected: boolean;
  offsetTop: number;
  onSelectedChange: (id: string, checked: boolean) => void;
  onRename: (bookmark: BookmarkNode) => void;
  onEditTags: (bookmark: BookmarkNode) => void;
  onDragStart: (id: string) => void;
  onDropBefore: (id: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(bookmark.id)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDropBefore(bookmark.id)}
      className="absolute grid w-full grid-cols-[44px_minmax(180px,1fr)_minmax(220px,1.2fr)_minmax(140px,0.7fr)_120px] items-center gap-2 border-b px-4 text-sm dark:border-slate-800"
      style={{ height: rowHeight, transform: `translateY(${offsetTop}px)` }}
    >
      <input type="checkbox" checked={selected} onChange={(event) => onSelectedChange(bookmark.id, event.target.checked)} aria-label={`Select ${bookmark.title}`} />
      <span className="min-w-0 truncate font-medium">
        {bookmark.title || 'Untitled'}
        {bookmark.tags && bookmark.tags.length > 0 ? <span className="ml-2 text-xs font-normal text-indigo-500">#{bookmark.tags.join(' #')}</span> : null}
      </span>
      <a href={bookmark.url} target="_blank" rel="noreferrer" className="min-w-0 truncate text-slate-500 hover:text-indigo-600">
        {bookmark.url}
      </a>
      <span className="min-w-0 truncate text-xs text-slate-500">{bookmark.path?.slice(0, -1).join(' / ')}</span>
      <span className="flex items-center gap-1">
        <button type="button" onClick={() => onRename(bookmark)} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-900" aria-label={`Rename ${bookmark.title}`}>
          <Edit3 size={15} />
        </button>
        <button type="button" onClick={() => onEditTags(bookmark)} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-900" aria-label={`Edit tags for ${bookmark.title}`}>
          <Tags size={15} />
        </button>
      </span>
    </div>
  );
}
