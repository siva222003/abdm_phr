import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import routes from "@/api";
import {
  ConsentArtefact,
  ConsentBase,
  ConsentCategories,
  ConsentQueryParams,
  ConsentRequest,
  ConsentStatuses,
  ConsentTypes,
} from "@/types/consent";
import { SubscriptionRequest } from "@/types/subscription";
import { query } from "@/utils/request/request";

const transformConsentRequest = (consent: ConsentRequest): ConsentBase => ({
  id: consent.requestId,
  type: ConsentTypes.CONSENT,
  requester: consent.requester.name || "-",
  purpose: consent.purpose.text,
  fromDate: consent.permission.dateRange.from,
  toDate: consent.permission.dateRange.to,
  status: consent.status,
});

const transformConsentArtefact = ({
  consentDetail,
  status,
}: ConsentArtefact): ConsentBase => ({
  id: consentDetail.consentId,
  type: ConsentTypes.CONSENT,
  requester: consentDetail.requester.name || "-",
  purpose: consentDetail.purpose.text,
  fromDate: consentDetail.permission.dateRange.from,
  toDate: consentDetail.permission.dateRange.to,
  status,
});

const transformSubscriptionRequest = (
  request: SubscriptionRequest,
): ConsentBase => ({
  id: request.subscriptionId || request.requestId,
  type: ConsentTypes.SUBSCRIPTION,
  requester: request.hiu.name || "-",
  purpose: request.purpose.text,
  fromDate: request.period.from,
  toDate: request.period.to,
  status: request.status,
});

const getQueryKey = (key: string, params: ConsentQueryParams) => [
  key,
  params.limit,
  params.offset,
  params.status,
  params.category,
];

const getQueryParams = (params: ConsentQueryParams) => ({
  queryParams: {
    limit: params.limit,
    offset: params.offset,
    status: params.status,
  },
});

export function useConsentData(params: ConsentQueryParams) {
  const {
    data: consentsResponse = [],
    isLoading: isLoadingRequests,
    isError: isRequestsError,
  } = useQuery({
    queryKey: getQueryKey("consentsRequests", params),
    queryFn: query.debounced(
      routes.consent.listRequests,
      getQueryParams(params),
    ),
    enabled: params.category === ConsentCategories.REQUESTS,
  });

  const {
    data: consentsArtefactsResponse = [],
    isLoading: isLoadingArtefacts,
    isError: isArtefactsError,
  } = useQuery({
    queryKey: getQueryKey("consentsArtefacts", params),
    queryFn: query.debounced(
      routes.consent.listArtefacts,
      getQueryParams(params),
    ),
    enabled: params.category === ConsentCategories.APPROVED,
  });

  const {
    data: subscriptionRequestsResponse = [],
    isLoading: isLoadingSubscriptions,
    isError: isSubscriptionsError,
  } = useQuery({
    queryKey: getQueryKey("subscriptionRequests", params),
    queryFn: query.debounced(
      routes.subscription.listRequests,
      getQueryParams(params),
    ),
  });

  const isLoading =
    isLoadingRequests || isLoadingArtefacts || isLoadingSubscriptions;
  const isError = isRequestsError || isArtefactsError || isSubscriptionsError;

  const isValidResponse = (response: any) => Array.isArray(response);

  const data = useMemo(() => {
    const consents: ConsentBase[] = [];

    if (isValidResponse(consentsResponse)) {
      consents.push(...consentsResponse.map(transformConsentRequest));
    }

    if (isValidResponse(consentsArtefactsResponse)) {
      consents.push(...consentsArtefactsResponse.map(transformConsentArtefact));
    }

    if (isValidResponse(subscriptionRequestsResponse)) {
      let requestsToProcess = subscriptionRequestsResponse;

      if (
        params.category === ConsentCategories.APPROVED &&
        params.status === ConsentStatuses.EXPIRED
      ) {
        requestsToProcess = subscriptionRequestsResponse.filter(
          (request) => !!request.subscriptionId,
        );
      }

      consents.push(...requestsToProcess.map(transformSubscriptionRequest));
    }

    return {
      consents,
      totalCount: consents.length,
    };
  }, [
    consentsResponse,
    consentsArtefactsResponse,
    subscriptionRequestsResponse,
    params.category,
    params.status,
  ]);

  const isEmpty = data.totalCount === 0;

  return {
    data,
    isLoading,
    isEmpty,
    isError,
  };
}
