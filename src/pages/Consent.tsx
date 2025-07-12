import { Box } from "lucide-react";
import { useQueryParams } from "raviger";
import { useMemo } from "react";

import { EmptyState } from "@/components/ui/empty-state";

import Page from "@/components/common/Page";
import ConsentCards from "@/components/consent/ConsentCard";
import { ConsentFilters } from "@/components/consent/ConsentFilters";
import ConsentTable from "@/components/consent/ConsentTable";

import { useConsentData } from "@/hooks/useConsentData";

import {
  CardGridSkeleton,
  TableSkeleton,
} from "@/common/loaders/SkeletonLoader";

import {
  ConsentCategories,
  ConsentCategory,
  ConsentQueryParams,
  ConsentStatus,
  ConsentStatusByCategory,
  ConsentStatuses,
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

  const { data, isLoading, isEmpty } = useConsentData(queryParams);

  const handleCategoryChange = (category: ConsentCategory) => {
    updateQuery({
      ...queryParams,
      category,
      status: ConsentStatusByCategory[category][0],
      offset: 0,
    });
  };

  const handleStatusChange = (status: ConsentStatus) => {
    updateQuery({
      ...queryParams,
      status,
      offset: 0,
    });
  };

  const handleViewConsent = (id: string, type: "consent" | "subscription") => {
    console.log(`View ${type}:`, id);
  };

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

  if (isEmpty) {
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

        {/* Mobile Card View */}
        <div className="md:hidden">
          <ConsentCards data={data} onView={handleViewConsent} />
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <ConsentTable data={data} onView={handleViewConsent} />
        </div>
      </div>
    </Page>
  );
}
