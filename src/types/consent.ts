export enum ConsentCategories {
  REQUESTS = "REQUESTS",
  APPROVED = "APPROVED",
}

export enum ConsentStatuses {
  ALL = "ALL",
  REQUESTED = "REQUESTED",
  GRANTED = "GRANTED",
  DENIED = "DENIED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

export enum ConsentTypes {
  CONSENT = "consent",
  ARTEFACT = "artefact",
  SUBSCRIPTION = "subscription",
  SUBSCRIPTION_ARTEFACT = "subscription-artefact",
}

export enum ConsentHITypes {
  PRESCRIPTION = "Prescription",
  DIAGNOSTIC_REPORT = "DiagnosticReport",
  OP_CONSULTATION = "OPConsultation",
  DISCHARGE_SUMMARY = "DischargeSummary",
  IMMUNIZATION_RECORD = "ImmunizationRecord",
  HEALTH_DOCUMENT_RECORD = "HealthDocumentRecord",
  WELLNESS_RECORD = "WellnessRecord",
}

export const CONSENT_STATUS_VARIANTS = {
  [ConsentStatuses.REQUESTED]: "yellow",
  [ConsentStatuses.GRANTED]: "green",
  [ConsentStatuses.DENIED]: "destructive",
  [ConsentStatuses.EXPIRED]: "secondary",
  [ConsentStatuses.REVOKED]: "secondary",
} as const;

export const CONSENT_TYPE_VARIANTS = {
  [ConsentTypes.CONSENT]: "blue",
  [ConsentTypes.SUBSCRIPTION]: "purple",
  [ConsentTypes.ARTEFACT]: "blue",
  [ConsentTypes.SUBSCRIPTION_ARTEFACT]: "purple",
} as const;

export const CONSENT_STATUS_BY_CATEGORY = {
  [ConsentCategories.REQUESTS]: [
    ConsentStatuses.ALL,
    ConsentStatuses.REQUESTED,
    ConsentStatuses.DENIED,
    ConsentStatuses.EXPIRED,
  ],
  [ConsentCategories.APPROVED]: [
    ConsentStatuses.GRANTED,
    ConsentStatuses.REVOKED,
    ConsentStatuses.EXPIRED,
  ],
} as const;

export type ConsentCategory = ConsentCategories;
export type ConsentStatus = ConsentStatuses;
export type ConsentType = ConsentTypes;
export type ConsentHIType = ConsentHITypes;

export interface ConsentPurpose {
  text: string;
  code: "CAREMGT" | "BTG" | "PUBHLTH" | "HPAYMT" | "DSRCH" | "PATRQT";
  refUri: string;
}

export interface ConsentPatient {
  id: string;
}

export interface ConsentHealthFacility {
  id: string;
  name?: string;
  type?: string;
}

export interface ConsentCareContext {
  patientReference: string;
  careContextReference: string;
}

export interface ConsentRequester {
  name?: string | null;
  identifier: {
    value: string;
    type: string;
    system: string;
  };
}

export interface ConsentDateRange {
  from: string;
  to: string;
}

export interface ConsentFrequency {
  unit: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  value: number;
  repeats: number;
}

export interface ConsentPermission {
  accessMode: "VIEW" | "STORE" | "QUERY" | "STREAM";
  dateRange: ConsentDateRange;
  dataEraseAt: string;
  frequency: ConsentFrequency;
}

export interface ConsentRequest {
  requestId: string;
  purpose: ConsentPurpose;
  patient: ConsentPatient;
  hip?: ConsentHealthFacility;
  hiu: ConsentHealthFacility;
  careContexts?: ConsentCareContext[];
  requester: ConsentRequester;
  status: ConsentStatus;
  createdAt: string;
  lastUpdated: string;
  hiType: ConsentHIType[];
  permission: ConsentPermission;
}

export interface ConsentArtefact {
  status: ConsentStatus;
  consentDetail: {
    consentId: string;
    purpose: ConsentPurpose;
    patient: ConsentPatient;
    hip: ConsentHealthFacility;
    hiu: ConsentHealthFacility;
    careContexts: ConsentCareContext[];
    requester: ConsentRequester;
    createdAt: string;
    lastUpdated: string;
    hiTypes: ConsentHIType[];
    permission: ConsentPermission;
  };
  signature: string;
}

export interface ConsentLinks extends ConsentCareContext {
  display?: string;
}

export interface ConsentRequestResponse {
  request: ConsentRequest;
  links: ConsentLinks[];
}

export interface ConsentArtefactResponse {
  artefact: ConsentArtefact;
  links: ConsentLinks[];
}

export interface ConsentApproveRequest {
  consents: {
    hiTypes: ConsentHIType[];
    hip: ConsentHealthFacility;
    careContexts: ConsentCareContext[];
    permission: ConsentPermission;
  }[];
}

export interface ConsentDenyRequest {
  reason?: string;
}

export interface ConsentRevokeRequest {
  consents: string[];
}

export interface ConsentUpdateBaseResponse {
  detail: string;
}

export interface ConsentBase {
  id: string;
  type: ConsentType;
  requester: string;
  purpose: string;
  fromDate: string;
  toDate: string;
  status: ConsentStatus;

  //detail specific info
  hiTypes: ConsentHIType[];
  links?: ConsentLinks[];
  subscriptionCategories?: ("LINK" | "DATA")[];
}

export interface ConsentQueryParams {
  category: ConsentCategory;
  status: ConsentStatus;
  limit: number;
  offset: number;
}

export function isConsentExpired(consent: ConsentBase): boolean {
  return consent.status === ConsentStatuses.EXPIRED;
}

export function isConsentActive(consent: ConsentBase): boolean {
  return consent.status === ConsentStatuses.GRANTED;
}
