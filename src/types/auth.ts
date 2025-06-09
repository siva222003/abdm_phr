import { PhrProfilePartial } from "@/types/profile";

export type AuthMode = "abha-number" | "mobile-number" | "abha-address";

export type FormMemory = {
  transactionId: string;
  mode: AuthMode;
  existingAbhaAddresses?: User[];
  phrProfile?: PhrProfilePartial & {
    password: string;
    state_code: string;
    district_code: string;
  };
};

export type PhrSendOtpBody = {
  value: string;
  otp_system?: "abdm" | "aadhaar";
  verify_system?: "abdm" | "aadhaar" | "password";
  type: AuthMode;
};

export type PhrSendOtpResponse = {
  transaction_id: string;
  detail: string;
};

export type PhrVerifyOtpBody =
  | (Omit<PhrSendOtpBody, "value"> & {
      otp: string;
      transaction_id: string;
    })
  | {
      password: string;
      abha_address: string;
    };

export type PhrVerifyOtpResponse = PhrSendOtpResponse & {
  users: User[];
  abha_number?: PhrProfilePartial;
};

export type PhrVerifyUserBody = {
  abha_address: string;
  transaction_id: string;
  type: AuthMode;
  verify_system: "abdm" | "aadhaar";
};

export type PhrAbhaAddressSuggestionsBody = {
  transaction_id: string;
  first_name: string;
  year_of_birth: string;
  last_name?: string;
  month_of_birth?: string;
  day_of_birth?: string;
};

export type PhrAbhaAddressSuggestionsResponse = {
  abha_addresses: string[];
  transaction_id: string;
};

export type User = {
  abhaAddress: string;
  fullName: string;
  abhaNumber: string;
  status: string;
  kycStatus: string;
};
