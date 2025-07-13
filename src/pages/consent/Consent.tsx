import { Box } from "lucide-react";
import { useQueryParams } from "raviger";
import { useCallback, useMemo } from "react";

import { EmptyState } from "@/components/ui/empty-state";

import Page from "@/components/common/Page";
import { ConsentFilters } from "@/components/consent/ConsentFilters";
import ConsentList from "@/components/consent/ConsentList";

import { useConsentData } from "@/hooks/useConsentData";

import {
  CardGridSkeleton,
  TableSkeleton,
} from "@/common/loaders/SkeletonLoader";

import {
  CONSENT_STATUS_BY_CATEGORY,
  ConsentCategories,
  ConsentCategory,
  ConsentQueryParams,
  ConsentStatus,
  ConsentStatuses,
  ConsentType,
} from "@/types/consent";

const DEFAULT_QUERY_PARAMS: ConsentQueryParams = {
  category: ConsentCategories.REQUESTS,
  status: ConsentStatuses.ALL,
  limit: 10,
  offset: 0,
};

export default function Consent() {
  const [qParams, updateQuery] = useQueryParams<ConsentQueryParams>();

  const queryParams = useMemo(
    () => ({
      ...DEFAULT_QUERY_PARAMS,
      ...qParams,
    }),
    [qParams],
  );

  const { data, isLoading, isEmpty, isError } = useConsentData(queryParams);

  const handleCategoryChange = useCallback(
    (category: ConsentCategory) => {
      updateQuery({
        ...queryParams,
        category,
        status: CONSENT_STATUS_BY_CATEGORY[category][0],
        offset: 0,
      });
    },
    [queryParams, updateQuery],
  );

  const handleStatusChange = useCallback(
    (status: ConsentStatus) => {
      updateQuery({
        ...queryParams,
        status,
        offset: 0,
      });
    },
    [queryParams, updateQuery],
  );

  const handleViewConsent = useCallback((id: string, type: ConsentType) => {
    console.log(`View ${type}:`, id);
  }, []);

  if (isLoading) {
    return (
      <Page title="Consents" hideTitleOnPage>
        <div className="w-full mx-auto mt-2">
          <ConsentFilters
            category={queryParams.category}
            status={queryParams.status}
            onCategoryChange={handleCategoryChange}
            onStatusChange={handleStatusChange}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:hidden">
            <CardGridSkeleton count={4} />
          </div>
          <div className="hidden md:block">
            <TableSkeleton count={5} />
          </div>
        </div>
      </Page>
    );
  }

  if (isEmpty || isError) {
    return (
      <Page title="Consents" hideTitleOnPage>
        <div className="w-full mx-auto mt-2">
          <ConsentFilters
            category={queryParams.category}
            status={queryParams.status}
            onCategoryChange={handleCategoryChange}
            onStatusChange={handleStatusChange}
          />
          <EmptyState
            icon={<Box className="size-6" />}
            title="No consents found"
            description="Adjust your filters to find the consents you're looking for"
          />
        </div>
      </Page>
    );
  }

  return (
    <Page title="Consents" hideTitleOnPage>
      <div className="w-full mx-auto mt-2">
        <ConsentFilters
          category={queryParams.category}
          status={queryParams.status}
          onCategoryChange={handleCategoryChange}
          onStatusChange={handleStatusChange}
        />

        <ConsentList data={data} onView={handleViewConsent} />
      </div>
    </Page>
  );
}
