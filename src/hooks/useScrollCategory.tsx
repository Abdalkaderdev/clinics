import { useState, useEffect, useCallback } from "react";

// Debounce utility for scroll events
const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

interface ScrollCategoryOptions {
  categories: string[];
  rootMargin?: string;
  threshold?: number;
}

export const useScrollCategory = ({
  categories,
  rootMargin = "-100px 0px 0px 0px",
  threshold = 0,
}: ScrollCategoryOptions) => {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0] || ""
  );
  const [observers, setObservers] = useState<Map<string, IntersectionObserver>>(
    new Map()
  );

  const scrollToCategory = useCallback((categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Use CSS scroll-margin on sections for reliable mobile offset
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const observeCategory = useCallback(
    (categoryId: string, element: HTMLElement) => {
      // Clean up existing observer for this category
      const existingObserver = observers.get(categoryId);
      if (existingObserver) {
        existingObserver.disconnect();
      }

      const debouncedSetActiveCategory = debounce(setActiveCategory, 100);
      
      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries.filter(
            (entry) => entry.isIntersecting
          );
          if (visibleEntries.length > 0) {
            const topEntry = visibleEntries.reduce((prev, curr) =>
              prev.boundingClientRect.top < curr.boundingClientRect.top
                ? prev
                : curr
            );
            const match = topEntry.target.id.match(/^category-(.+)$/);
            if (match) {
              debouncedSetActiveCategory(match[1]);
            }
          }
        },
        {
          rootMargin,
          threshold,
        }
      );

      observer.observe(element);

      setObservers((prev) => new Map(prev.set(categoryId, observer)));

      return () => {
        observer.disconnect();
        setObservers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(categoryId);
          return newMap;
        });
      };
    },
    [rootMargin, threshold, observers]
  );

  useEffect(() => {
    return () => {
      // Cleanup all observers on unmount
      observers.forEach((observer) => observer.disconnect());
    };
  }, [observers]);

  return {
    activeCategory,
    scrollToCategory,
    observeCategory,
  };
};
