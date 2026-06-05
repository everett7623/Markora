import { useMemo, useState } from 'react';

interface VirtualItem<T> {
  item: T;
  index: number;
  offsetTop: number;
}

export function useVirtualList<T>(items: T[], rowHeight: number, viewportHeight: number, overscan = 8) {
  const [scrollTop, setScrollTop] = useState(0);
  const totalHeight = items.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const virtualItems = useMemo<Array<VirtualItem<T>>>(
    () =>
      items.slice(startIndex, endIndex).map((item, index) => ({
        item,
        index: startIndex + index,
        offsetTop: (startIndex + index) * rowHeight
      })),
    [endIndex, items, rowHeight, startIndex]
  );

  return { virtualItems, totalHeight, setScrollTop };
}
