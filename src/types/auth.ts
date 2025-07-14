import { AUTH_METHODS, DEFAULT_AUTH_METHOD } from "@/common/constants";

import { PhrEnrolDetails, PhrProfilePartial, User } from "./profile";

export enum AuthModes {
  ABHA_NUMBER = "abha-number",
  MOBILE_NUMBER = "mobile-number",
  ABHA_ADDRESS = "abha-address",
  EMAIL = "email",
}

export enum AuthFlowTypes {
  ENROLLMENT = "enrollment",
  LOGIN = "login",
}

export type AuthMode = AuthModes;
export type AuthFlowType = AuthFlowTypes;
export type AuthMethod = (typeof AUTH_METHODS)[number];

export interface FormMemory {
  transactionId: string;
  mode: AuthMode;
  verifySystem: AuthMethod;
  existingAbhaAddresses?: User[];
  phrProfile: PhrEnrolDetails;
}

export interface SendOtpRequest {
  value: string;
  type: AuthMode;
  otp_system?: AuthMethod;
  verify_system?: AuthMethod;
}

export interface VerifyOtpRequest extends Omit<SendOtpRequest, "value"> {
  otp: string;
  transaction_id: string;
}

export interface VerifyPasswordRequest {
  password: string;
  abha_address: string;
  type: "abha-address";
  verify_system: "password";
}

export interface VerifyUserRequest {
  abha_address: string;
  transaction_id: string;
  type: AuthMode;
  verify_system: AuthMethod;
}

export interface CheckAuthMethodsRequest {
  abha_address: string;
  verify_system: AuthMethod;
}

export interface RefreshAccessTokenRequest {
  refresh: string;
}

export interface AbhaAddressSuggestionsRequest {
  transaction_id: string;
  first_name: string;
  year_of_birth: string;
  last_name?: string;
  month_of_birth?: string;
  day_of_birth?: string;
}

export interface AbhaAddressExistsRequest {
  abha_address: string;
}

export interface AbhaAddressEnrolRequest {
  transaction_id: string;
  phr_details: PhrEnrolDetails;
}

export interface SendOtpResponse {
  transaction_id: string;
  detail: string;
}

export interface VerifyOtpResponse extends SendOtpResponse {
  users: User[];
  abha_number?: PhrProfilePartial;
}

export interface VerifyAuthResponse {
  abha_number: PhrProfilePartial;
  switchProfileEnabled: boolean;
  access_token: string;
  refresh_token: string;
}

export interface CheckAuthMethodsResponse {
  auth_methods: ["MOBILE_OTP", "PASSWORD", "AADHAAR_OTP"];
}

export interface AbhaAddressSuggestionsResponse {
  abha_addresses: string[];
  transaction_id: string;
}

export interface AbhaAddressExistsResponse {
  exists: boolean;
}

export const INITIAL_AUTH_FORM_VALUES: FormMemory = {
  transactionId: "",
  mode: AuthModes.MOBILE_NUMBER,
  verifySystem: DEFAULT_AUTH_METHOD,
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
