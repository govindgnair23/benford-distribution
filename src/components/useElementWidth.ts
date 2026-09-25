import { useEffect, useRef, useState } from "react";

// Tracks an element's rendered width so SVG charts can draw in real pixels
// (keeping text at a readable size). Falls back to `fallback` where
// ResizeObserver is unavailable, such as jsdom.
export function useElementWidth(fallback: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}
