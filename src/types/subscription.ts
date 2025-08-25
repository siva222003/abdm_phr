import {
  ConsentDateRange,
  ConsentHITypes,
  ConsentHealthFacility,
  ConsentLinks,
  ConsentPatient,
  ConsentPurpose,
  ConsentStatuses,
} from "@/types/consent";

export enum SubscriptionCategories {
  LINK = "LINK",
  DATA = "DATA",
}

export interface SubscriptionRequest {
  subscriptionId?: string;
  requestId: string;
  createdAt: string;
  lastUpdated: string;
  purpose: ConsentPurpose;
  patient: ConsentPatient;
  hiu: ConsentHealthFacility;
  hips?: ConsentHealthFacility[];
  categories: SubscriptionCategories[];
  period: ConsentDateRange;
  status: ConsentStatuses;
  requestType: "HIU" | "HEALTH_LOCKER";
}

export interface SubscriptionSource {
  hip?: ConsentHealthFacility | null;
  categories: SubscriptionCategories[];
  hiTypes: ConsentHITypes[];
  period: ConsentDateRange;
  purpose: ConsentPurpose;
}

export interface SubscriptionArtefact {
  subscriptionId: string;
  purpose: ConsentPurpose;
  status: ConsentStatuses;
  dateCreated: string;
  dateGranted: string;
  patient: ConsentPatient;
  requester: ConsentHealthFacility;
  includedSources: SubscriptionSource[];
}

export interface SubscriptionRequestResponse {
  request: SubscriptionRequest;
  links: ConsentLinks[];
  availableLinks: ConsentLinks[];
}

export interface SubscriptionArtefactResponse {
  artefact: SubscriptionArtefact;
  links: ConsentLinks[];
  availableLinks: ConsentLinks[];
}

export interface SubscriptionApproveRequest {
  isApplicableForAllHIPs: boolean;
  includedSources: SubscriptionSource[];
  excludedSources?: SubscriptionSource[];
}

export interface SubscriptionDenyRequest {
  reason?: string;
}

export interface SubscriptionStatusUpdateRequest {
  enable: boolean;
}

export interface SubscriptionEditRequest {
  hiuId: string;
  subscription: SubscriptionApproveRequest;
}

export interface SubscriptionUpdateBaseResponse {
  detail: string;
}
