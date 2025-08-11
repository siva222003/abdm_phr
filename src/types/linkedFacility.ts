import { HealthFacility } from "./gateway";

export interface PatientCareContext {
  referenceNumber: string;
  display: string;
}

export interface Patient {
  referenceNumber: string;
  display: string;
  careContexts: PatientCareContext[];
  hiType: string;
  count: number;
}

export interface UnverifiedIdentifier {
  type: "MOBILE" | "ABHA_NUMBER" | "MR" | "abhaAddress";
  value: string;
}

export interface UserInitLinkingDiscoverRequest {
  hip: HealthFacility;
  unverifiedIdentifiers?: UnverifiedIdentifier[];
}

export interface UserInitLinkingDiscoverResponse {
  transactionId: string;
  patient: Patient[];
  createdAt: string;
}

export interface UserInitLinkingInitRequest {
  transactionId: string;
  patient: Patient;
}

export interface ReferenceMeta {
  communicationMedium: "MOBILE";
  communicationHint: "OTP";
  communicationExpiry: string;
}

export interface ReferenceLink {
  referenceNumber: string;
  authenticationType: "DIRECT" | "MEDIATE";
  meta: ReferenceMeta;
}

export interface UserInitLinkingInitResponse {
  transactionId: string;
  link: ReferenceLink;
}

export interface UserInitLinkingConfirmRequest {
  linkRefNumber: string;
  token: string;
}
