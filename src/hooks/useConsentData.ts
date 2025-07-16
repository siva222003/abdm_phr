import { useQuery } from "@tanstack/react-query";

import routes from "@/api";
import {
  ConsentArtefact,
  ConsentArtefactResponse,
  ConsentBase,
  ConsentCategories,
  ConsentLinks,
  ConsentQueryParams,
  ConsentRequest,
  ConsentRequestResponse,
  ConsentStatuses,
  ConsentType,
  ConsentTypes,
} from "@/types/consent";
import {
  SubscriptionArtefact,
  SubscriptionArtefactResponse,
  SubscriptionRequest,
  SubscriptionRequestResponse,
} from "@/types/subscription";
import { query } from "@/utils/request/request";

const transformConsentRequest = (
  consent: ConsentRequest,
  links: ConsentLinks[] = [],
): ConsentBase => ({
  id: consent.requestId,
  type: ConsentTypes.CONSENT,
  requester: consent.requester?.name || "-",
  purpose: consent.purpose?.text || "-",
  fromDate: consent.permission?.dateRange?.from || "",
  toDate: consent.permission?.dateRange?.to || "",
  status: consent.status,

  // information required for consent details page
  hiTypes: consent.hiType || [],
  links,
});

const transformConsentArtefact = (
  artefact: ConsentArtefact,
  links: ConsentLinks[] = [],
): ConsentBase => ({
  id: artefact.consentDetail?.consentId || "",
  type: ConsentTypes.ARTEFACT,
  requester: artefact.consentDetail?.requester?.name || "-",
  purpose: artefact.consentDetail?.purpose?.text || "-",
  fromDate: artefact.consentDetail?.permission?.dateRange?.from || "",
  toDate: artefact.consentDetail?.permission?.dateRange?.to || "",
  status: artefact.status,

  // information required for consent details page
  hiTypes: artefact.consentDetail?.hiTypes || [],
  links,
});

const transformSubscriptionRequest = (
  request: SubscriptionRequest,
  category: ConsentCategories,
  links: ConsentLinks[] = [],
): ConsentBase => ({
  id:
    category === ConsentCategories.APPROVED
      ? request.subscriptionId!
      : request.requestId,
  type: ConsentTypes.SUBSCRIPTION,
  requester: request.hiu?.name || "-",
  purpose: request.purpose?.text || "-",
  fromDate: request.period?.from || "",
  toDate: request.period?.to || "",
  status: request.status,

  // information required for consent details page
  hiTypes: [],
  subscriptionCategories: request.categories || [],
  links,
});

const transformSubscriptionArtefact = (
  artefact: SubscriptionArtefact,
  links: ConsentLinks[] = [],
): ConsentBase => ({
  id: artefact.subscriptionId,
  type: ConsentTypes.SUBSCRIPTION_ARTEFACT,
  requester: artefact.requester?.name || "-",
  purpose: artefact.purpose?.text || "-",
  fromDate: artefact.includedSources?.[0]?.period?.from || "",
  toDate: artefact.includedSources?.[0]?.period?.to || "",
  status: artefact.status,

  // information required for consent details page
  hiTypes: artefact.includedSources?.[0]?.hiTypes || [],
  subscriptionCategories: artefact.includedSources?.[0]?.categories || [],
  links,
});

const getQueryParams = (params: ConsentQueryParams) => ({
  queryParams: {
    status: params.status,
    offset: params.offset,
    limit: params.limit,
  },
});

export function useConsentList(params: ConsentQueryParams) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "consents",
      params.category,
      params.status,
      params.offset,
      params.limit,
    ],
    queryFn: async ({ signal }) => {
      const consents: ConsentBase[] = [];

      if (params.category === ConsentCategories.REQUESTS) {
        const consentRequests: ConsentRequest[] = await query.debounced(
          routes.consent.listRequests,
          getQueryParams(params),
        )({ signal });

        if (Array.isArray(consentRequests)) {
          consents.push(
            ...consentRequests.map((req) => transformConsentRequest(req)),
          );
        }
      }

      if (params.category === ConsentCategories.APPROVED) {
        const consentArtefacts: ConsentArtefact[] = await query.debounced(
          routes.consent.listArtefacts,
          getQueryParams(params),
        )({ signal });

        if (Array.isArray(consentArtefacts)) {
          consents.push(
            ...consentArtefacts.map((art) => transformConsentArtefact(art)),
          );
        }
      }

      const subscriptionRequests: SubscriptionRequest[] = await query.debounced(
        routes.subscription.listRequests,
        getQueryParams(params),
      )({ signal });

      if (Array.isArray(subscriptionRequests)) {
        let requestsToProcess = subscriptionRequests;

        if (
          params.category === ConsentCategories.APPROVED &&
          params.status === ConsentStatuses.EXPIRED
        ) {
          requestsToProcess = subscriptionRequests.filter(
            (request) => !!request.subscriptionId,
          );
        }

        consents.push(
          ...requestsToProcess.map((req) =>
            transformSubscriptionRequest(req, params.category),
          ),
        );
      }

      return {
        consents,
        totalCount: consents.length,
      };
    },
  });

  return {
    data,
    isLoading,
    isError,
    isEmpty: (data?.totalCount || 0) === 0,
  };
}

interface ConsentDetailParams {
  id: string;
  requestType: ConsentType;
}

export function useConsentDetail(params: ConsentDetailParams) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["consents", params.id],
    queryFn: async ({ signal }) => {
      let consent: ConsentBase | null = null;

      if (params.requestType === ConsentTypes.CONSENT) {
        const consentRequests: ConsentRequestResponse = await query(
          routes.consent.getRequest,
          {
            pathParams: {
              requestId: params.id,
            },
          },
        )({ signal });

        consent = transformConsentRequest(consentRequests.request);
      }

      if (params.requestType === ConsentTypes.ARTEFACT) {
        const consentArtefacts: ConsentArtefactResponse = await query(
          routes.consent.getArtefact,
          {
            pathParams: {
              artefactId: params.id,
            },
          },
        )({ signal });

        consent = transformConsentArtefact(consentArtefacts.artefact);
      }

      if (params.requestType === ConsentTypes.SUBSCRIPTION) {
        const subscriptionRequests: SubscriptionRequestResponse = await query(
          routes.subscription.getRequest,
          {
            pathParams: {
              requestId: params.id,
            },
          },
        )({ signal });

        consent = transformSubscriptionRequest(
          subscriptionRequests.request,
          ConsentCategories.REQUESTS,
        );
      }

      if (params.requestType === ConsentTypes.SUBSCRIPTION_ARTEFACT) {
        const subscriptionArtefacts: SubscriptionArtefactResponse = await query(
          routes.subscription.getArtefact,
          {
            pathParams: {
              artefactId: params.id,
            },
          },
        )({ signal });

        consent = transformSubscriptionArtefact(subscriptionArtefacts.artefact);
      }

      return {
        consent,
      };
    },
  });

  return {
    data,
    isLoading,
    isError,
  };
}
