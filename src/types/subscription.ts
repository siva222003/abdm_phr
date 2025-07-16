import {
  ConsentDateRange,
  ConsentHIType,
  ConsentHealthFacility,
  ConsentLinks,
  ConsentPatient,
  ConsentPurpose,
  ConsentStatus,
} from "@/types/consent";

export type SubscriptionCategory = "LINK" | "DATA";
export type SubscriptionRequestType = "HIU" | "HEALTH_LOCKER";

export interface SubscriptionRequest {
  subscriptionId?: string;
  requestId: string;
  createdAt: string;
  lastUpdated: string;
  purpose: ConsentPurpose;
  patient: ConsentPatient;
  hiu: ConsentHealthFacility;
  hips?: ConsentHealthFacility[];
  categories: SubscriptionCategory[];
  period: ConsentDateRange;
  status: ConsentStatus;
  requestType: SubscriptionRequestType;
}

export interface SubscriptionSource {
  hip?: ConsentHealthFacility;
  categories: SubscriptionCategory[];
  hiTypes: ConsentHIType[];
  period: ConsentDateRange;
  status: ConsentStatus;
}

export interface SubscriptionArtefact {
  subscriptionId: string;
  purpose: ConsentPurpose;
  status: ConsentStatus;
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
