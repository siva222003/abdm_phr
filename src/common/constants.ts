export const DOMAIN = "@sbx";
export const OTP_LENGTH = 6;
export const RESEND_OTP_DURATION = 60;

export const LocalStorageKeys = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  switchProfileEnabled: "switch_profile_enabled",
} as const;

export const REFRESH_TOKEN_REFETCH_INTERVAL = 1000 * 60 * 5;

export const DEFAULT_AUTH_METHOD = "abdm";

export const AUTH_METHOD_CHOICES = [
  {
    id: "abdm",
    label: "Mobile OTP",
  },
  {
    id: "aadhaar",
    label: "Aadhaar OTP",
  },
  {
    id: "password",
    label: "Password",
  },
] as const;

export const AUTH_METHODS = AUTH_METHOD_CHOICES.map(
  (choice) => choice.id,
) as (typeof AUTH_METHOD_CHOICES)[number]["id"][];

export const GENDER_CHOICES = [
  {
    id: "M",
    label: "Male",
  },
  {
    id: "F",
    label: "Female",
  },
  {
    id: "O",
    label: "Other",
  },
] as const;

export const GENDERS = GENDER_CHOICES.map(
  (choice) => choice.id,
) as (typeof GENDER_CHOICES)[number]["id"][];

export const MAX_FILE_SIZE_KB = 100;
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const CONSENT_LIST_LIMIT = 8;
