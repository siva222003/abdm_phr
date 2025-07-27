import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import routes from "@/api";
import {
  ConsentArtefact,
  ConsentArtefactResponse,
  ConsentBase,
  ConsentCategories,
  ConsentHITypes,
  ConsentLinks,
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

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ConsentListParams {
  category: ConsentCategories;
  status: ConsentStatuses;
  limit: number;
  offset: number;
}

interface ConsentDetailParams {
  id: string;
  requestType: ConsentTypes;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Transforms query parameters for API requests
 * @param params - The consent list parameters
 * @returns Formatted query parameters for the API
 */
const buildQueryParams = (params: ConsentListParams) => ({
  queryParams: {
    status: params.status,
    offset: params.offset,
    limit: params.limit,
  },
});

// ============================================================================
// DATA TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transforms a ConsentRequest from the API into a standardized ConsentBase format
 * @param consent - Raw consent request from API
 * @param links - Optional consent links data
 * @returns Standardized ConsentBase object
 */
const transformConsentRequest = (
  consent: ConsentRequest,
  links: ConsentLinks[] = [],
): ConsentBase => ({
  id: consent.requestId,
  type: ConsentTypes.CONSENT,
  requester: consent.requester.name || "-",
  hiu: consent.hiu,
  purpose: consent.purpose,
  fromDate: consent.permission.dateRange?.from || "",
  toDate: consent.permission.dateRange?.to || "",
  status: consent.status,
  hiTypes: consent.hiTypes,
  links,

  dataEraseAt: consent.permission.dataEraseAt || "",
  rawPermission: consent.permission,
});

/**
 * Transforms a ConsentArtefact from the API into a standardized ConsentBase format
 * @param artefact - Raw consent artefact from API
 * @param links - Optional consent links data
 * @returns Standardized ConsentBase object
 */
const transformConsentArtefact = (
  { status, consentDetail }: ConsentArtefact,
  links: ConsentLinks[] = [],
): ConsentBase => ({
  id: consentDetail?.consentId,
  type: ConsentTypes.ARTEFACT,
  requester: consentDetail.requester.name || "-",
  hiu: consentDetail.hiu,
  purpose: consentDetail.purpose,
  fromDate: consentDetail.permission.dateRange?.from || "",
  toDate: consentDetail.permission.dateRange?.to || "",
  status,
  hiTypes: consentDetail.hiTypes,
  links,

  dataEraseAt: consentDetail.permission.dataEraseAt || "",
  rawPermission: consentDetail.permission,
});

/**
 * Transforms a SubscriptionRequest from the API into a standardized ConsentBase format
 * @param request - Raw subscription request from API
 * @param links - Optional consent links data
 * @param availableLinks - Optional available consent links data
 * @returns Standardized ConsentBase object
 */
const transformSubscriptionRequest = (
  request: SubscriptionRequest,
  links: ConsentLinks[] = [],
  availableLinks: ConsentLinks[] = [],
): ConsentBase => ({
  id: request.subscriptionId || request.requestId,
  type: request.subscriptionId
    ? ConsentTypes.SUBSCRIPTION_ARTEFACT
    : ConsentTypes.SUBSCRIPTION,
  requester: request.hiu.name || "-",
  hiu: request.hiu,
  purpose: request.purpose,
  fromDate: request.period.from || "",
  toDate: request.period.to || "",
  status: request.status,
  hiTypes: Object.values(ConsentHITypes),
  links,

  subscriptionCategories: request.categories,
  availableLinks,
});

/**
 * Transforms a SubscriptionArtefact from the API into a standardized ConsentBase format
 * @param artefact - Raw subscription artefact from API
 * @param links - Optional consent links data
 * @param availableLinks - Optional available consent links data
 * @returns Standardized ConsentBase object
 */
const transformSubscriptionArtefact = (
  artefact: SubscriptionArtefact,
  links: ConsentLinks[] = [],
  availableLinks: ConsentLinks[] = [],
): ConsentBase => ({
  id: artefact.subscriptionId,
  type: ConsentTypes.SUBSCRIPTION_ARTEFACT,
  requester: artefact.requester.name || "-",
  hiu: artefact.requester,
  purpose: artefact.purpose,
  fromDate: artefact.includedSources?.[0]?.period?.from || "",
  toDate: artefact.includedSources?.[0]?.period?.to || "",
  status: artefact.status,
  hiTypes: artefact.includedSources?.[0]?.hiTypes || [],
  links,

  subscriptionCategories: artefact.includedSources?.[0]?.categories || [],
  availableLinks,
});

// ============================================================================
// DATA FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetches consent requests based on category and transforms them
 * @param params - Query parameters
 * @param signal - AbortSignal for request cancellation
 * @returns Array of transformed consent requests
 */
const fetchConsentRequests = async (
  params: ConsentListParams,
  signal: AbortSignal,
): Promise<ConsentBase[]> => {
  const consentRequests = await query.debounced(
    routes.consent.listRequests,
    buildQueryParams(params),
  )({ signal });

  return consentRequests?.map((req) => transformConsentRequest(req)) || [];
};

/**
 * Fetches consent artefacts based on category and transforms them
 * @param params - Query parameters
 * @param signal - AbortSignal for request cancellation
 * @returns Array of transformed consent artefacts
 */
const fetchConsentArtefacts = async (
  params: ConsentListParams,
  signal: AbortSignal,
): Promise<ConsentBase[]> => {
  const consentArtefacts = await query.debounced(
    routes.consent.listArtefacts,
    buildQueryParams(params),
  )({ signal });

  return consentArtefacts?.map((art) => transformConsentArtefact(art)) || [];
};

/**
 * Fetches subscription requests and transforms them
 * @param params - Query parameters
 * @param signal - AbortSignal for request cancellation
 * @returns Array of transformed subscription requests
 */
const fetchSubscriptionRequests = async (
  params: ConsentListParams,
  signal: AbortSignal,
): Promise<ConsentBase[]> => {
  const subscriptionRequests = await query.debounced(
    routes.subscription.listRequests,
    buildQueryParams(params),
  )({ signal });

  // Filter requests for approved expired subscriptions
  let requestsToProcess = subscriptionRequests;
  if (
    params.category === ConsentCategories.APPROVED &&
    params.status === ConsentStatuses.EXPIRED
  ) {
    requestsToProcess = subscriptionRequests.filter(
      (request) => !!request.subscriptionId,
    );
  }

  return (
    requestsToProcess?.map((req) => transformSubscriptionRequest(req)) || []
  );
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Custom hook to fetch and manage consent list data
 *
 * Fetches different types of consent data based on category:
 * - REQUESTS: Fetches consent requests and subscription requests
 * - APPROVED: Fetches consent artefacts and filtered subscription requests
 *
 * @param params - Query parameters including category, status, pagination
 * @returns Object containing data, loading state, error state, and empty state
 *
 * @example
 * ```typescript
 * const { data, isLoading, isError, isEmpty } = useConsentList({
 *   category: ConsentCategories.REQUESTS,
 *   status: ConsentStatuses.ALL,
 *   limit: 10,
 *   offset: 0
 * });
 * ```
 */
export function useConsentList(params: ConsentListParams) {
  const {
    data: consentData,
    isLoading: consentLoading,
    isError: consentError,
  } = useQuery({
    queryKey: [
      "consents",
      params.category,
      params.status,
      params.offset,
      params.limit,
    ],
    queryFn: async ({ signal }) => {
      if (params.category === ConsentCategories.REQUESTS) {
        return fetchConsentRequests(params, signal);
      }

      if (params.category === ConsentCategories.APPROVED) {
        return fetchConsentArtefacts(params, signal);
      }

      return [];
    },
    enabled: !!params.category && !!params.status,
  });

  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
  } = useQuery({
    queryKey: [
      "subscriptions",
      params.category,
      params.status,
      params.offset,
      params.limit,
    ],
    queryFn: async ({ signal }) => {
      return fetchSubscriptionRequests(params, signal);
    },
    enabled: !!params.category && !!params.status,
  });

  const data = useMemo(() => {
    return [...(consentData || []), ...(subscriptionData || [])];
  }, [consentData, subscriptionData]);

  return {
    data,
    isLoading: consentLoading || subscriptionLoading,
    isError: consentError || subscriptionError,
    isEmpty: data.length === 0,
  };
}

/**
 * Custom hook to fetch detailed consent information by ID and type
 *
 * Fetches specific consent details based on the request type:
 * - CONSENT: Fetches consent request details
 * - ARTEFACT: Fetches consent artefact details
 * - SUBSCRIPTION: Fetches subscription request details
 * - SUBSCRIPTION_ARTEFACT: Fetches subscription artefact details
 *
 * @param params - Object containing consent ID and request type
 * @returns Object containing consent data, loading state, and error state
 *
 * @example
 * ```typescript
 * const { data, isLoading, isError } = useConsentDetail({
 *   id: "consent-123",
 *   requestType: ConsentTypes.CONSENT
 * });
 * ```
 */
export function useConsentDetail(params: ConsentDetailParams) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["consents", params.id, params.requestType],
    queryFn: async ({ signal }) => {
      switch (params.requestType) {
        case ConsentTypes.CONSENT: {
          const response: ConsentRequestResponse = await query(
            routes.consent.getRequest,
            {
              pathParams: { requestId: params.id },
            },
          )({ signal });
          return transformConsentRequest(response.request, response.links);
        }

        case ConsentTypes.ARTEFACT: {
          const response: ConsentArtefactResponse = await query(
            routes.consent.getArtefact,
            {
              pathParams: { artefactId: params.id },
            },
          )({ signal });
          return transformConsentArtefact(response.artefact, response.links);
        }

        case ConsentTypes.SUBSCRIPTION: {
          const response: SubscriptionRequestResponse = await query(
            routes.subscription.getRequest,
            {
              pathParams: { requestId: params.id },
            },
          )({ signal });
          return transformSubscriptionRequest(
            response.request,
            response.links,
            response.availableLinks,
          );
        }

        case ConsentTypes.SUBSCRIPTION_ARTEFACT: {
          const response: SubscriptionArtefactResponse = await query(
            routes.subscription.getArtefact,
            {
              pathParams: { artefactId: params.id },
            },
          )({ signal });
          return transformSubscriptionArtefact(
            response.artefact,
            response.links,
            response.availableLinks,
          );
        }

        default:
          throw new Error(`Unsupported request type: ${params.requestType}`);
      }
    },
    enabled: !!params.id,
  });

  return {
    data,
    isLoading,
    isError,
  };
}
