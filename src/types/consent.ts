// Constants
export const ConsentCategories = {
  REQUESTS: "REQUESTS",
  APPROVED: "APPROVED",
} as const;

export const ConsentStatuses = {
  ALL: "ALL",
  REQUESTED: "REQUESTED",
  GRANTED: "GRANTED",
  DENIED: "DENIED",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
} as const;

export const ConsentStatusByCategory = {
  REQUESTS: ["ALL", "REQUESTED", "DENIED", "EXPIRED"],
  APPROVED: ["GRANTED", "REVOKED", "EXPIRED"],
} as const;

export const CONSENT_STATUS_COLORS = {
  REQUESTED: "yellow",
  DENIED: "danger",
  GRANTED: "green",
  EXPIRED: "secondary",
  REVOKED: "orange",
} as const;

export const CONSENT_TYPE_COLORS = {
  consent: "blue",
  subscription: "purple",
} as const;

// Type Defs
export type ConsentCategory =
  (typeof ConsentCategories)[keyof typeof ConsentCategories];

export type ConsentStatus =
  (typeof ConsentStatuses)[keyof typeof ConsentStatuses];

export type ConsentHIType =
  | "Prescription"
  | "DiagnosticReport"
  | "OPConsultation"
  | "DischargeSummary"
  | "ImmunizationRecord"
  | "HealthDocumentRecord"
  | "WellnessRecord";

export type ConsentPurpose = {
  text: string;
  code: "CAREMGT" | "BTG" | "PUBHLTH" | "HPAYMT" | "DSRCH" | "PATRQT";
  refUri: string;
};

export type ConsentPatient = {
  id: string;
};

export type ConsentHealthFacility = {
  id: string;
  name?: string;
  type?: string;
};

type ConsentCareContext = {
  patientReference: string;
  careContextReference: string;
};

type ConsentRequester = {
  name: string;
  identifier: {
    value: string;
    type: string;
    system: string;
  };
};

export type ConsentDateRange = {
  from: string;
  to: string;
};

type ConsentPermission = {
  accessMode: "VIEW" | "STORE" | "QUERY" | "STREAM";
  dateRange: ConsentDateRange;
  dataEraseAt: string;
  frequency: {
    unit: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
    value: number;
    repeats: number;
  };
};

export type ConsentRequest = {
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
};

export type ConsentArtefact = {
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
};

// API Types
export type PaginationResponse = {
  size: number;
  limit: number;
  offset: number;
};

export type ConsentRequestsResponse = {
  requests: ConsentRequest[];
} & PaginationResponse;

export type ConsentArtefactsResponse = {
  consentArtefacts: ConsentArtefact[];
} & PaginationResponse;

export type ConsentApproveRequest = {
  consents: {
    hiTypes: ConsentHIType[];
    hip: ConsentHealthFacility;
    careContexts: ConsentCareContext[];
    permission: ConsentPermission;
  }[];
};

export type ConsentDenyRequest = {
  reason?: string;
};

export type ConsentRevokeRequest = {
  consents: string[];
};

export type ConsentUpdateBaseResponse = {
  detail: string;
};

// Common Base Types
export type ConsentBase = {
  id: string;
  type: "consent" | "subscription";
  requester: string;
  purpose: string;
  fromDate: string;
  toDate: string;
  status: ConsentStatus;
};

export type ConsentQueryParams = {
  category: ConsentCategory;
  status: ConsentStatus;
  limit: number;
  offset: number;
};
