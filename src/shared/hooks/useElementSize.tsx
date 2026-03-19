'use client';
import { useLayoutEffect, useRef, useState } from 'react';

type Size = { width: number; height: number };

export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 초기 측정
    const read = () =>
      setSize({
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
      });
    read();

    // 변화 감지
    const ro = new ResizeObserver(entries => {
      const entry = entries[0];
      // 일부 브라우저는 borderBoxSize 지원
      // 지원되면 더 정확, 아니면 getBoundingClientRect로 fallback
      const box = entry.borderBoxSize?.[0];
      if (box) setSize({ width: box.inlineSize, height: box.blockSize });
      else read();
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  return { ref, ...size };
}

export function useElementSizeWidth<T extends HTMLElement>() {
  const { ref, width } = useElementSize<T>();
  return { ref_w: ref, width };
}
export function useElementSizeHeight<T extends HTMLElement>() {
  const { ref, height } = useElementSize<T>();
  return { ref_h: ref, height };
}

