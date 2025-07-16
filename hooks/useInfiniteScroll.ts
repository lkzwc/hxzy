"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

// 简单的节流函数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

interface UseInfiniteScrollOptions {
  threshold?: number; // 距离底部多少像素时触发加载
  rootMargin?: string; // IntersectionObserver 的 rootMargin
  enabled?: boolean; // 是否启用无限滚动
  delay?: number; // 节流延迟
}

interface UseInfiniteScrollReturn {
  isFetching: boolean;
  setIsFetching: (fetching: boolean) => void;
  lastElementRef: (node: HTMLElement | null) => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
}

export function useInfiniteScroll(
  fetchMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const {
    threshold = 100,
    rootMargin = '0px',
    enabled = true,
    delay = 200,
  } = options;

  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLElement | null>(null);

  // 节流的加载函数
  const throttledFetchMore = useCallback(
    throttle(async () => {
      if (isFetching || !hasMore || !enabled) return;
      
      setIsFetching(true);
      try {
        await fetchMore();
      } catch (error) {
        console.error('Failed to fetch more data:', error);
      } finally {
        setIsFetching(false);
      }
    }, delay),
    [fetchMore, isFetching, hasMore, enabled, delay]
  );

  // 创建 IntersectionObserver
  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isFetching) {
          throttledFetchMore();
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, hasMore, isFetching, rootMargin, throttledFetchMore]);

  // 观察最后一个元素
  const lastElementRefCallback = useCallback(
    (node: HTMLElement | null) => {
      if (!enabled) return;
      
      if (observerRef.current && lastElementRef.current) {
        observerRef.current.unobserve(lastElementRef.current);
      }
      
      lastElementRef.current = node;
      
      if (observerRef.current && node) {
        observerRef.current.observe(node);
      }
    },
    [enabled]
  );

  // 备用滚动监听（兼容性）
  useEffect(() => {
    if (!enabled || observerRef.current) return;

    const handleScroll = throttle(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - threshold
      ) {
        throttledFetchMore();
      }
    }, delay);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, threshold, delay, throttledFetchMore]);

  return {
    isFetching,
    setIsFetching,
    lastElementRef: lastElementRefCallback,
    hasMore,
    setHasMore,
  };
}

// 虚拟滚动 Hook（用于大量数据）
interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // 额外渲染的项目数量
}

export function useVirtualScroll<T>(
  items: T[],
  options: UseVirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleCount + overscan * 2
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback(
    throttle((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, 16), // 60fps
    []
  );

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  };
}
