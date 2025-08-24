import { FolderOpen } from "lucide-react";
import { useEffect } from "react";

import { EmptyState } from "@/components/ui/empty-state";

import LoadMoreButton from "@/components/common/LoadMore";
import Page from "@/components/common/Page";
import { ConsentFilters } from "@/components/consent/ConsentFilters";
import ConsentList from "@/components/consent/ConsentList";

import { useConsentList } from "@/hooks/useConsentData";
import { useQueryParams } from "@/hooks/useQueryParams";

import {
  CardGridSkeleton,
  TableSkeleton,
} from "@/common/loaders/SkeletonLoader";

import {
  CONSENT_STATUS_BY_CATEGORY,
  ConsentCategories,
  ConsentStatuses,
} from "@/types/consent";

export const CONSENT_LIST_LIMIT = 9;

export default function Consent() {
  const { params, updateQuery } = useQueryParams({
    limit: CONSENT_LIST_LIMIT,
    includePage: false,
  });

  useEffect(() => {
    if (params.category && params.status) return;

    updateQuery({
      category: ConsentCategories.REQUESTS,
      status: ConsentStatuses.REQUESTED,
    });
  }, [params.category, params.status, updateQuery]);

  const {
    data,
    isLoading,
    isEmpty,
    isError,
    fetchNextPage,
    hasMore,
    isFetchingNextPage,
  } = useConsentList(params);

  const handleCategoryChange = (category: ConsentCategories) => {
    updateQuery({
      category,
      status: CONSENT_STATUS_BY_CATEGORY[category][0],
    });
  };

  const handleStatusChange = (status: ConsentStatuses) => {
    updateQuery({
      status,
    });
  };

  const filterProps = {
    category: params.category as ConsentCategories,
    status: params.status as ConsentStatuses,
    onCategoryChange: handleCategoryChange,
    onStatusChange: handleStatusChange,
  };

  return (
    <Page title="Consents" hideTitleOnPage>
      <div className="w-full mx-auto mt-2">
        <ConsentFilters {...filterProps} />

        {isLoading && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:hidden">
              <CardGridSkeleton count={4} />
            </div>
            <div className="hidden md:block">
              <TableSkeleton count={5} />
            </div>
          </>
        )}

        {(isEmpty || isError) && !isLoading && (
          <EmptyState
            icon={FolderOpen}
            title="No consents found"
            description="Adjust your filters to find the consents you're looking for"
          />
        )}

        {data && data.length > 0 && !isLoading && <ConsentList data={data} />}
        <LoadMoreButton
          onLoadMore={fetchNextPage}
          hasMore={hasMore}
          isLoading={isFetchingNextPage}
        />
      </div>
    </Page>
  );
}
