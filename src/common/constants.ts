const DOMAIN = "@sbx";
const OTP_LENGTH = 6;

const LocalStorageKeys = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
} as const;

export const REFRESH_TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000;

export { DOMAIN, OTP_LENGTH, LocalStorageKeys };
