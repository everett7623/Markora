import { useRef, useState, useEffect } from 'react';

export function useContainerHeight(defaultHeight = 600) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });

    observer.observe(element);
    setHeight(element.clientHeight);

    return () => observer.disconnect();
  }, []);

  return { ref, height };
}
