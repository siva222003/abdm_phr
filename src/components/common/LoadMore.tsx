import { ArrowUpFromLine, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  scrollThreshold?: number;
}

const LoadMoreButton = ({
  onLoadMore,
  isLoading = false,
  hasMore = true,
  scrollThreshold = 300,
}: LoadMoreButtonProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > scrollThreshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollThreshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {hasMore && (
        <div className="flex justify-center mt-8 mb-16 sm:mb-4">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
            className="flex items-center justify-center gap-2 w-full ssm:max-w-xs rounded-lg border-gray-300 bg-white hover:bg-gray-50 transition disabled:opacity-50 text-sm sm:text-base py-2 sm:py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin text-gray-500" />
                <span className="font-medium text-gray-600">Loading...</span>
              </>
            ) : (
              <>
                <span className="font-medium text-gray-700">Load More</span>
                <ChevronDown className="size-5   text-gray-500" />
              </>
            )}
          </Button>
        </div>
      )}

      {isScrolled && (
        <Button
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full shadow-md hover:shadow-lg transition bg-white border border-gray-200 p-3 sm:p-4 opacity-90 hover:opacity-100 hover:bg-gray-50"
          aria-label="Scroll to top"
        >
          <ArrowUpFromLine className="size-4 sm:size-5 text-gray-700" />
        </Button>
      )}
    </>
  );
};

export default LoadMoreButton;
