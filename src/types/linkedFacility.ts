import { ProviderIdentifier } from "./gateway";

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
  hip: ProviderIdentifier;
  unverifiedIdentifiers?: UnverifiedIdentifier[];
}

export interface UserInitLinkingDiscoverResponse {
  transactionId: string;
  patient: Patient[];
  createdAt: string;
}

export interface UserInitLinkingInitRequest {
  hip: ProviderIdentifier;
  transactionId: string;
  patient: Patient[];
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
  hip: ProviderIdentifier;
  linkRefNumber: string;
  token: string;
}

export interface UserInitLinkingBaseResponse {
  request_id: string;
}

export interface UserInitLinkingCheckStatusResponse {
  status: "pending" | "completed" | "failed";
  data: UserInitLinkingDiscoverResponse | UserInitLinkingInitResponse;
}
