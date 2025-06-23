import { KycStatus, PhrEnrolDetails, PhrProfilePartial } from "./profile";

// Common types for authentication and verification
export const AUTH_MODES = {
  ABHA_NUMBER: "abha-number",
  MOBILE_NUMBER: "mobile-number",
  ABHA_ADDRESS: "abha-address",
} as const;

export const AUTH_FLOW_TYPES = {
  ENROLLMENT: "enrollment",
  LOGIN: "login",
} as const;

export type AuthMode = (typeof AUTH_MODES)[keyof typeof AUTH_MODES];
export type FlowType = (typeof AUTH_FLOW_TYPES)[keyof typeof AUTH_FLOW_TYPES];

export type VerifySystem = "abdm" | "aadhaar";
export type AuthMethod =
  | "MOBILE_OTP"
  | "PASSWORD"
  | "EMAIL_OTP"
  | "AADHAAR_OTP";

export type User = {
  abhaAddress: string;
  fullName: string;
  abhaNumber: string;
  status: string;
  kycStatus: KycStatus;
};

// Verification specific types
export type SendOtpRequest = {
  value: string;
  type: AuthMode;
  otp_system?: VerifySystem;
  verify_system?: VerifySystem;
};

export type SendOtpResponse = {
  transaction_id: string;
  detail: string;
};

export type VerifyOtpRequest = {
  otp: string;
  transaction_id: string;
} & Omit<SendOtpRequest, "value">;

export type VerifyOtpResponse = SendOtpResponse & {
  users: User[];
  abha_number?: PhrProfilePartial;
};

export type VerifyPasswordRequest = {
  password: string;
  abha_address: string;
  type: "abha-address";
  verify_system: "password";
};

export type VerifyUserRequest = {
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
export type CheckAuthMethodsRequest = {
  abha_address: string;
};

export type CheckAuthMethodsResponse = {
  auth_methods: AuthMethod[];
  abha_number: string;
};

export type RefreshAccessTokenRequest = {
  refresh: string;
};

export type RefreshAccessTokenResponse = Omit<
  VerifyAuthResponse,
  "abha_number" | "switchProfileEnabled"
>;

// Enrolment specific types
export type AbhaAddressSuggestionsRequest = {
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

export type AbhaAddressExistsRequest = {
  abha_address: string;
};

export type AbhaAddressExistsResponse = {
  exists: boolean;
};

export type AbhaAddressEnrolRequest = {
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

// Common Auth Constants
export const INITIAL_AUTH_FORM_VALUES: FormMemory = {
  transactionId: "mock-id",
  mode: "mobile-number",
  verifySystem: "abdm",
  existingAbhaAddresses: [],
  phrProfile: {
    abha_address: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "O",
    day_of_birth: "",
    month_of_birth: "",
    year_of_birth: "",
    address: "",
    state_name: "",
    state_code: "",
    district_name: "",
    district_code: "",
    pincode: "",
    mobile: "",
    email: "",
    profile_photo: "",
    password: "",
  },
};
