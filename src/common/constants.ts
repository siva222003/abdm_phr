import { FormMemory } from "@/types/auth";

const DOMAIN = "@sbx";
const OTP_LENGTH = 6;

const LocalStorageKeys = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  switchProfileEnabled: "switch_profile_enabled",
} as const;

export const REFRESH_TOKEN_REFETCH_INTERVAL = 1000 * 60 * 5;

const InitialAuthFormValues: FormMemory = {
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

export { DOMAIN, OTP_LENGTH, LocalStorageKeys, InitialAuthFormValues };
