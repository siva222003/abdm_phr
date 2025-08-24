import { ArrowUp, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface LoadMoreScrollTopProps {
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean; // from backend
  scrollThreshold?: number; // px before showing scroll-to-top
  scrollParent?: HTMLElement | null; // scroll container; defaults to window
}

const LoadMoreScrollTop: React.FC<LoadMoreScrollTopProps> = ({
  onLoadMore,
  isLoading = false,
  hasMore = true,
  scrollThreshold = 300,
  scrollParent = null,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const getScrollTop = () => {
    if (scrollParent) return scrollParent.scrollTop;
    return window.scrollY || document.documentElement.scrollTop || 0;
  };

  useEffect(() => {
    if (hasMore) {
      setIsScrolled(false);
      return;
    }

    const target: HTMLElement | Window = scrollParent ?? window;

    const onScroll = () => {
      setIsScrolled(getScrollTop() > scrollThreshold);
    };

    // initial check
    setIsScrolled(getScrollTop() > scrollThreshold);

    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [hasMore, scrollParent, scrollThreshold]);

  const scrollToTop = () => {
    if (scrollParent && "scrollTo" in scrollParent) {
      scrollParent.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // CASE 1: still has more → show Load More button
  if (hasMore) {
    return (
      <div className="flex justify-center mt-8">
        <Button
          onClick={onLoadMore}
          disabled={isLoading}
          size="lg"
          variant="outline"
          className="flex items-center gap-2 w-full max-w-xs rounded-full shadow-sm hover:shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          <span className="font-medium">
            {isLoading ? "Loading..." : "Load More"}
          </span>
        </Button>
      </div>
    );
  }

  // CASE 2: no more data AND user scrolled → show floating Scroll-to-Top
  if (!hasMore && isScrolled) {
    return (
      <Button
        size="icon"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Scroll to top"
      >
        <ArrowUp className="size-5" />
      </Button>
    );
  }

  // CASE 3: no more data + not scrolled → show nothing
  return null;
};

export default LoadMoreScrollTop;
