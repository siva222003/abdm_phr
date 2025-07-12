import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import routes from "@/api";
import {
  ConsentBase,
  ConsentCategories,
  ConsentQueryParams,
  ConsentStatuses,
} from "@/types/consent";
import { query } from "@/utils/request/request";

export function useConsentData(params: ConsentQueryParams) {
  const { data: consentsResponse, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["consentsRequests", params],
    queryFn: query.debounced(routes.consent.listRequests, {
      queryParams: {
        limit: params.limit,
        offset: params.offset,
        status: params.status,
      },
    }),
    enabled: params.category === ConsentCategories.REQUESTS,
  });

  const { data: consentsArtefactsResponse, isLoading: isLoadingArtefacts } =
    useQuery({
      queryKey: ["consentsArtefacts", params],
      queryFn: query.debounced(routes.consent.listArtefacts, {
        queryParams: {
          limit: params.limit,
          offset: params.offset,
          status: params.status,
        },
      }),
      enabled: params.category === ConsentCategories.APPROVED,
    });

  const {
    data: subscriptionRequestsResponse,
    isLoading: isLoadingSubscriptions,
  } = useQuery({
    queryKey: ["subscriptionRequests", params],
    queryFn: query.debounced(routes.subscription.listRequests, {
      queryParams: {
        limit: params.limit,
        offset: params.offset,
        status: params.status,
      },
    }),
  });

  const isLoading =
    isLoadingRequests || isLoadingArtefacts || isLoadingSubscriptions;

  const data = useMemo(() => {
    const consents: ConsentBase[] = [];

    if ((consentsResponse?.size ?? 0) > 0 && consentsResponse?.requests) {
      consents.push(
        ...consentsResponse.requests.map((consent) => ({
          id: consent.requestId,
          type: "consent" as const,
          requester: consent.requester.name,
          purpose: consent.purpose.text,
          fromDate: consent.permission.dateRange.from,
          toDate: consent.permission.dateRange.to,
          status: consent.status,
        })),
      );
    }

    if (
      (consentsArtefactsResponse?.size ?? 0) > 0 &&
      consentsArtefactsResponse?.consentArtefacts
    ) {
      consents.push(
        ...consentsArtefactsResponse.consentArtefacts.map(
          ({ consentDetail, status }) => ({
            id: consentDetail.consentId,
            type: "consent" as const,
            requester: consentDetail.requester.name,
            purpose: consentDetail.purpose.text,
            fromDate: consentDetail.permission.dateRange.from,
            toDate: consentDetail.permission.dateRange.to,
            status,
          }),
        ),
      );
    }

    if (
      (subscriptionRequestsResponse?.size ?? 0) > 0 &&
      subscriptionRequestsResponse?.requests
    ) {
      const filteredRequests = subscriptionRequestsResponse.requests.filter(
        (request) => {
          if (
            params.category === ConsentCategories.APPROVED &&
            params.status === ConsentStatuses.EXPIRED
          ) {
            return request.subscriptionId;
          }
          return true;
        },
      );

      consents.push(
        ...filteredRequests.map((request) => ({
          id: request.subscriptionId || request.requestId,
          type: "subscription" as const,
          requester: request.hiu.name || "-",
          purpose: request.purpose.text,
          fromDate: request.period.from,
          toDate: request.period.to,
          status: request.status,
        })),
      );
    }

    return {
      consents,
      totalSize:
        (consentsResponse?.size || 0) +
        (consentsArtefactsResponse?.size || 0) +
        (subscriptionRequestsResponse?.size || 0),
    };
  }, [
    consentsResponse,
    consentsArtefactsResponse,
    subscriptionRequestsResponse,
    params,
  ]);

  const isEmpty = data.totalSize === 0;

  return { data, isLoading, isEmpty };
}
