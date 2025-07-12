import {
  ConsentDateRange,
  ConsentHIType,
  ConsentHealthFacility,
  ConsentPatient,
  ConsentPurpose,
  ConsentStatus,
} from "@/types/consent";
import { PaginationResponse } from "@/types/consent";

// Type Defs
export type SubscriptionCategory = "LINK" | "DATA";
export type SubscriptionRequestType = "HIU" | "HEALTH_LOCKER";

export type SubscriptionRequest = {
  subscriptionId: string;
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
};

export type SubscriptionSource = {
  hip: ConsentHealthFacility;
  categories: SubscriptionCategory[];
  hiTypes: ConsentHIType[];
  period: ConsentDateRange;
  status: ConsentStatus;
};

export type SubscriptionArtefact = {
  subscriptionId: string;
  purpose: ConsentPurpose;
  status: ConsentStatus;
  dateCreated: string;
  dateGranted: string;
  patient: ConsentPatient;
  requester: ConsentHealthFacility;
  includedSources: SubscriptionSource[];
};

// API Types
export type SubscriptionRequestResponse = {
  requests: SubscriptionRequest[];
} & PaginationResponse;

export type SubscriptionEditAndApproveRequest = {
  isApplicableForAllHIPs: boolean;
  includedSources: SubscriptionSource[];
  excludedSources?: SubscriptionSource[];
};

export type SubscriptionDenyRequest = {
  reason?: string;
};

export type SubscriptionStatusUpdateRequest = {
  enabled: boolean;
};

export type SubscriptionUpdateBaseResponse = {
  detail: string;
};
