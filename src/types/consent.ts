// ================================
// ENUMS & CONSTANTS
// ================================

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
  CONSENT = "Consent",
  SUBSCRIPTION = "Subscription",
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

export enum ConsentPurposeCodes {
  CAREMGT = "CAREMGT",
  BTG = "BTG",
  PUBHLTH = "PUBHLTH",
  HPAYMT = "HPAYMT",
  DSRCH = "DSRCH",
  PATRQT = "PATRQT",
}

export enum ConsentAccessModes {
  VIEW = "VIEW",
  STORE = "STORE",
  QUERY = "QUERY",
  STREAM = "STREAM",
}

export enum ConsentFrequencyUnits {
  HOUR = "HOUR",
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

// UI variants for badges/status colors
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
} as const;

// Business logic mappings
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

// ================================
// TYPE DEFINITIONS
// ================================

export type ConsentCategory = ConsentCategories;
export type ConsentStatus = ConsentStatuses;
export type ConsentType = ConsentTypes;
export type ConsentHIType = ConsentHITypes;
export type ConsentPurposeCode = ConsentPurposeCodes;
export type ConsentAccessMode = ConsentAccessModes;
export type ConsentFrequencyUnit = ConsentFrequencyUnits;

// ================================
// CORE TYPES
// ================================

export interface ConsentPurpose {
  text: string;
  code: ConsentPurposeCode;
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
  unit: ConsentFrequencyUnit;
  value: number;
  repeats: number;
}

export interface ConsentPermission {
  accessMode: ConsentAccessMode;
  dateRange: ConsentDateRange;
  dataEraseAt: string;
  frequency: ConsentFrequency;
}

// ================================
// API TYPES
// ================================

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

// ================================
// UTILITY TYPES
// ================================

// Unified type for UI components
export interface ConsentBase {
  id: string;
  type: ConsentType;
  requester: string;
  purpose: string;
  fromDate: string;
  toDate: string;
  status: ConsentStatus;
}

export interface ConsentQueryParams {
  category: ConsentCategory;
  status: ConsentStatus;
  limit: number;
  offset: number;
}

// ================================
// UTILITY FUNCTIONS
// ================================

export function isConsentExpired(consent: ConsentBase): boolean {
  return consent.status === ConsentStatuses.EXPIRED;
}

export function isConsentActive(consent: ConsentBase): boolean {
  return consent.status === ConsentStatuses.GRANTED;
}
