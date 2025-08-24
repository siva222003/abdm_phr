import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import routes from "@/api";
import { CONSENT_LIST_LIMIT } from "@/pages/consent/Consent";
import {
  ConsentArtefact,
  ConsentArtefactResponse,
  ConsentBase,
  ConsentCategories,
  ConsentHITypes,
  ConsentLinks,
  ConsentListResponse,
  ConsentRequest,
  ConsentRequestResponse,
  ConsentStatuses,
  ConsentTypes,
} from "@/types/consent";
import {
  SubscriptionArtefact,
  SubscriptionArtefactResponse,
  SubscriptionRequest,
  SubscriptionRequestResponse,
} from "@/types/subscription";
import { query } from "@/utils/request/request";
import { QueryParams } from "@/utils/request/types";

interface ConsentDetailParams {
  id: string;
  requestType: ConsentTypes;
}

const buildQueryParams = (params: QueryParams, page: number) => ({
  queryParams: {
    status: params.status,
    limit: CONSENT_LIST_LIMIT,
    offset: (page - 1) * CONSENT_LIST_LIMIT,
  },
});

const transformConsentRequest = (
  consent: ConsentRequest,
  links: ConsentLinks[] = [],
): ConsentBase => ({
  id: consent.requestId,
  type: ConsentTypes.CONSENT,
  requester: consent.requester.name?.trim() || "-",
  hiu: consent.hiu,
  purpose: consent.purpose,
  fromDate: consent.permission.dateRange?.from ?? "",
  toDate: consent.permission.dateRange?.to ?? "",
  status: consent.status,
  hiTypes: consent.hiTypes,
  links,
  dataEraseAt: consent.permission.dataEraseAt ?? "",
  rawPermission: consent.permission,
});

const transformConsentArtefact = (
  { status, consentDetail }: ConsentArtefact,
  links: ConsentLinks[] = [],
): ConsentBase => ({
  id: consentDetail?.consentId,
  type: ConsentTypes.ARTEFACT,
  requester: consentDetail?.requester?.name?.trim() || "-",
  hiu: consentDetail?.hiu,
  purpose: consentDetail?.purpose,
  fromDate: consentDetail?.permission.dateRange?.from ?? "",
  toDate: consentDetail?.permission.dateRange?.to ?? "",
  status,
  hiTypes: consentDetail?.hiTypes ?? [],
  links,
  dataEraseAt: consentDetail?.permission.dataEraseAt ?? "",
  rawPermission: consentDetail?.permission,
});

const transformSubscriptionRequest = (
  request: SubscriptionRequest,
  links: ConsentLinks[] = [],
  availableLinks: ConsentLinks[] = [],
): ConsentBase => ({
  id: request.subscriptionId ?? request.requestId,
  type: request.subscriptionId
    ? ConsentTypes.SUBSCRIPTION_ARTEFACT
    : ConsentTypes.SUBSCRIPTION,
  requester: request.hiu.name?.trim() || "-",
  hiu: request.hiu,
  purpose: request.purpose,
  fromDate: request.period.from ?? "",
  toDate: request.period.to ?? "",
  status: request.status,
  hiTypes: Object.values(ConsentHITypes),
  links,
  subscriptionCategories: request.categories,
  availableLinks,
});

const transformSubscriptionArtefact = (
  artefact: SubscriptionArtefact,
  links: ConsentLinks[] = [],
  availableLinks: ConsentLinks[] = [],
): ConsentBase => ({
  id: artefact.subscriptionId,
  type: ConsentTypes.SUBSCRIPTION_ARTEFACT,
  requester: artefact.requester.name?.trim() || "-",
  hiu: artefact.requester,
  purpose: artefact.purpose,
  fromDate: artefact.includedSources?.[0]?.period?.from ?? "",
  toDate: artefact.includedSources?.[0]?.period?.to ?? "",
  status: artefact.status,
  hiTypes: artefact.includedSources?.[0]?.hiTypes ?? [],
  links,
  subscriptionCategories: artefact.includedSources?.[0]?.categories ?? [],
  availableLinks,
});

const fetchCombinedData = async (
  params: QueryParams,
  page: number,
  signal: AbortSignal,
): Promise<ConsentListResponse<ConsentBase>> => {
  const promises: Promise<{
    results: ConsentBase[];
    hasMore: boolean;
  }>[] = [];

  // Consent queries
  if (params.category === ConsentCategories.REQUESTS) {
    promises.push(
      query
        .debounced(
          routes.consent.listRequests,
          buildQueryParams(params, page),
        )({
          signal,
        })
        .then((response) => ({
          results:
            response?.results?.map((consent) =>
              transformConsentRequest(consent),
            ) ?? [],
          hasMore: response?.hasMore ?? false,
        })),
    );
  } else if (params.category === ConsentCategories.APPROVED) {
    promises.push(
      query
        .debounced(
          routes.consent.listArtefacts,
          buildQueryParams(params, page),
        )({ signal })
        .then((response) => ({
          results:
            response?.results?.map((artefact) =>
              transformConsentArtefact(artefact),
            ) ?? [],
          hasMore: response?.hasMore ?? false,
        })),
    );
  }

  // Subscription queries (always included)
  promises.push(
    query
      .debounced(
        routes.subscription.listRequests,
        buildQueryParams(params, page),
      )({ signal })
      .then((response) => {
        let requestsToProcess = response?.results ?? [];

        // For expired + approved, only include subscriptions with IDs
        if (
          params.category === ConsentCategories.APPROVED &&
          params.status === ConsentStatuses.EXPIRED
        ) {
          requestsToProcess = requestsToProcess.filter(
            (req) => !!req.subscriptionId,
          );
        }

        return {
          results: requestsToProcess.map((request) =>
            transformSubscriptionRequest(request),
          ),
          hasMore: response?.hasMore ?? false,
        };
      }),
  );

  const responses = await Promise.all(promises);

  return {
    results: responses.flatMap((r) => r.results),
    hasMore: responses.some((r) => r.hasMore),
  };
};

export function useConsentList(params: QueryParams) {
  const query = useInfiniteQuery({
    queryKey: ["consents", params],
    queryFn: ({ signal, pageParam = 1 }) =>
      fetchCombinedData(params, pageParam, signal),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: Boolean(params.category && params.status),
    select: (data) => data.pages.flatMap((page) => page.results),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isEmpty: query.data?.length === 0,
    hasMore: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useConsentDetail(params: ConsentDetailParams) {
  const { id, requestType } = params;

  return useQuery({
    queryKey: ["consents", id, requestType],
    queryFn: async ({ signal }) => {
      switch (requestType) {
        case ConsentTypes.CONSENT: {
          const res: ConsentRequestResponse = await query(
            routes.consent.getRequest,
            { pathParams: { requestId: id } },
          )({ signal });
          return transformConsentRequest(res.request, res.links);
        }
        case ConsentTypes.ARTEFACT: {
          const res: ConsentArtefactResponse = await query(
            routes.consent.getArtefact,
            { pathParams: { artefactId: id } },
          )({ signal });
          return transformConsentArtefact(res.artefact, res.links);
        }
        case ConsentTypes.SUBSCRIPTION: {
          const res: SubscriptionRequestResponse = await query(
            routes.subscription.getRequest,
            { pathParams: { requestId: id } },
          )({ signal });
          return transformSubscriptionRequest(
            res.request,
            res.links,
            res.availableLinks,
          );
        }
        case ConsentTypes.SUBSCRIPTION_ARTEFACT: {
          const res: SubscriptionArtefactResponse = await query(
            routes.subscription.getArtefact,
            { pathParams: { artefactId: id } },
          )({ signal });
          return transformSubscriptionArtefact(
            res.artefact,
            res.links,
            res.availableLinks,
          );
        }
        default:
          throw new Error(`Unsupported request type: ${requestType}`);
      }
    },
    enabled: Boolean(id),
  });
}
