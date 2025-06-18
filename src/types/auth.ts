import { KycStatus, PhrEnrolDetails, PhrProfilePartial } from "./profile";

// Common types for authentication and verification
export type AuthMode = "abha-number" | "mobile-number" | "abha-address";
export type VerifySystem = "abdm" | "aadhaar";
export type AuthMethod =
  | "MOBILE_OTP"
  | "PASSWORD"
  | "EMAIL_OTP"
  | "AADHAAR_OTP";

export type FlowType = "enrollment" | "login";
export type User = {
  abhaAddress: string;
  fullName: string;
  abhaNumber: string;
  status: string;
  kycStatus: KycStatus;
};

// Verification specific types
export type SendOtpBody = {
  value: string;
  type: AuthMode;
  otp_system?: VerifySystem;
  verify_system?: VerifySystem;
};

export type SendOtpResponse = {
  transaction_id: string;
  detail: string;
};

export type VerifyOtpBody = {
  otp: string;
  transaction_id: string;
} & Omit<SendOtpBody, "value">;

export type VerifyOtpResponse = SendOtpResponse & {
  users: User[];
  abha_number?: PhrProfilePartial;
};

export type VerifyPasswordBody = {
  password: string;
  abha_address: string;
  type: "abha-address";
  verify_system: "password";
};

export type VerifyUserBody = {
  abha_address: string;
  transaction_id: string;
  type: AuthMode;
  verify_system: VerifySystem;
};

export type VerifyAuthResponse = {
  abha_number: PhrProfilePartial;
  switchProfileEnabled: boolean;
  access_token: string;
  refresh_token: string;
};

// Login specific types
export type CheckAuthMethodsBody = {
  abha_address: string;
};

export type CheckAuthMethodsResponse = {
  auth_methods: AuthMethod[];
  abha_number: string;
};

export type RefreshAccessTokenBody = {
  refresh: string;
};

export type RefreshAccessTokenResponse = Omit<
  VerifyAuthResponse,
  "abha_number" | "switchProfileEnabled"
>;

// Enrolment specific types
export type AbhaAddressSuggestionsBody = {
  transaction_id: string;
  first_name: string;
  year_of_birth: string;
  last_name?: string;
  month_of_birth?: string;
  day_of_birth?: string;
};

export type AbhaAddressSuggestionsResponse = {
  abha_addresses: string[];
  transaction_id: string;
};

export type AbhaAddressExistsBody = {
  abha_address: string;
};

export type AbhaAddressExistsResponse = {
  exists: boolean;
};

export type EnrolAddressBody = {
  transaction_id: string;
  phr_details: PhrEnrolDetails;
};

// Form memory type to store state during the auth flow
export type FormMemory = {
  transactionId: string;
  mode: AuthMode;
  verifySystem: VerifySystem;
  existingAbhaAddresses?: User[];
  phrProfile?: PhrEnrolDetails;
};
