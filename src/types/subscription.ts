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
  hip?: ConsentHealthFacility;
  categories: SubscriptionCategories[];
  hiTypes: ConsentHITypes[];
  period: ConsentDateRange;
  status: ConsentStatuses;
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
}

export interface SubscriptionArtefactResponse {
  artefact: SubscriptionArtefact;
  links: ConsentLinks[];
}

export interface SubscriptionEditAndApproveRequest {
  isApplicableForAllHIPs: boolean;
  includedSources: SubscriptionSource[];
  excludedSources?: SubscriptionSource[];
}

export interface SubscriptionDenyRequest {
  reason?: string;
}

export interface SubscriptionStatusUpdateRequest {
  enabled: boolean;
}

export interface SubscriptionUpdateBaseResponse {
  detail: string;
}
