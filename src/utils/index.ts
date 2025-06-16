import { LocalStorageKeys } from "@/common/constants";

export const TokenStorage = {
  getAccessToken: () => localStorage.getItem(LocalStorageKeys.accessToken),
  getRefreshToken: () => localStorage.getItem(LocalStorageKeys.refreshToken),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(LocalStorageKeys.accessToken, access);
    localStorage.setItem(LocalStorageKeys.refreshToken, refresh);
  },
  clear: () => {
    localStorage.removeItem(LocalStorageKeys.accessToken);
    localStorage.removeItem(LocalStorageKeys.refreshToken);
  },
};
