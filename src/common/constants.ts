const DOMAIN = "@sbx";
const OTP_LENGTH = 6;
const RESEND_OTP_DURATION = 60;

const LocalStorageKeys = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  switchProfileEnabled: "switch_profile_enabled",
} as const;

const REFRESH_TOKEN_REFETCH_INTERVAL = 1000 * 60 * 5;

export {
  DOMAIN,
  OTP_LENGTH,
  LocalStorageKeys,
  RESEND_OTP_DURATION,
  REFRESH_TOKEN_REFETCH_INTERVAL,
};
