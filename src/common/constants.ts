const DOMAIN = "@sbx";
const OTP_LENGTH = 6;

const LocalStorageKeys = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
} as const;

export { DOMAIN, OTP_LENGTH, LocalStorageKeys };
