import { FolderOpen } from "lucide-react";
import { useQueryParams } from "raviger";
import { useEffect } from "react";

import { EmptyState } from "@/components/ui/empty-state";

import Page from "@/components/common/Page";
import { ConsentFilters } from "@/components/consent/ConsentFilters";
import ConsentList from "@/components/consent/ConsentList";

import { useConsentList } from "@/hooks/useConsentData";

import { CONSENT_LIST_LIMIT } from "@/common/constants";
import {
  CardGridSkeleton,
  TableSkeleton,
} from "@/common/loaders/SkeletonLoader";

import {
  CONSENT_STATUS_BY_CATEGORY,
  ConsentCategories,
  ConsentStatuses,
} from "@/types/consent";

interface ConsentQueryParams {
  category: ConsentCategories;
  status: ConsentStatuses;
  limit: number;
  offset: number;
}

const DEFAULT_QUERY_PARAMS: ConsentQueryParams = {
  category: ConsentCategories.REQUESTS,
  status: ConsentStatuses.REQUESTED,
  limit: CONSENT_LIST_LIMIT,
  offset: 0,
};

const normalizeQueryParams = (
  qParams: Partial<ConsentQueryParams>,
): ConsentQueryParams => {
  const category = qParams.category || DEFAULT_QUERY_PARAMS.category;

  let status = qParams.status;
  if (!status || !CONSENT_STATUS_BY_CATEGORY[category]?.includes(status)) {
    status =
      CONSENT_STATUS_BY_CATEGORY[category]?.[0] || DEFAULT_QUERY_PARAMS.status;
  }

  return {
    category,
    status,
    limit: qParams.limit || DEFAULT_QUERY_PARAMS.limit,
    offset: qParams.offset || DEFAULT_QUERY_PARAMS.offset,
  };
};

export default function Consent() {
  const [qParams, setQParams] = useQueryParams<ConsentQueryParams>();

  useEffect(() => {
    setQParams(normalizeQueryParams(qParams));
  }, []);

  const { data, isLoading, isEmpty, isError } = useConsentList(qParams);

  const handleCategoryChange = (category: ConsentCategories) => {
    setQParams({
      ...qParams,
      category,
      status: CONSENT_STATUS_BY_CATEGORY[category][0],
      offset: 0,
    });
  };

  const handleStatusChange = (status: ConsentStatuses) => {
    setQParams({
      ...qParams,
      status,
      offset: 0,
    });
  };

  const filterProps = {
    category: qParams.category,
    status: qParams.status,
    onCategoryChange: handleCategoryChange,
    onStatusChange: handleStatusChange,
  };

  if (isLoading) {
    return (
      <Page title="Consents" hideTitleOnPage>
        <div className="w-full mx-auto mt-2">
          <ConsentFilters {...filterProps} />
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
          <ConsentFilters {...filterProps} />
          <EmptyState
            icon={<FolderOpen className="text-primary" />}
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
        <ConsentFilters {...filterProps} />
        <ConsentList data={data} />
      </div>
    </Page>
  );
}
