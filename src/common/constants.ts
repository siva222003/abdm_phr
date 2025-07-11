export const DOMAIN = "@sbx";
export const OTP_LENGTH = 6;
export const RESEND_OTP_DURATION = 60;

export const LocalStorageKeys = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  switchProfileEnabled: "switch_profile_enabled",
} as const;

export const REFRESH_TOKEN_REFETCH_INTERVAL = 1000 * 60 * 5;

export const DEFAULT_OTP_SYSTEM = "abdm";
