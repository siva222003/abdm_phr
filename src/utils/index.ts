import { LocalStorageKeys } from "@/common/constants";

export const TokenStorage = {
  getAccessToken: () => localStorage.getItem(LocalStorageKeys.accessToken),
  getRefreshToken: () => localStorage.getItem(LocalStorageKeys.refreshToken),
  getSwitchProfileEnabled: () =>
    localStorage.getItem(LocalStorageKeys.switchProfileEnabled) === "true",
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(LocalStorageKeys.accessToken, access);
    localStorage.setItem(LocalStorageKeys.refreshToken, refresh);
  },
  clear: () => {
    localStorage.removeItem(LocalStorageKeys.accessToken);
    localStorage.removeItem(LocalStorageKeys.refreshToken);
    localStorage.removeItem(LocalStorageKeys.switchProfileEnabled);
  },
  setSwitchProfileEnabled: (enabled: boolean) => {
    localStorage.setItem(
      LocalStorageKeys.switchProfileEnabled,
      String(enabled),
    );
  },
};

export const formatDate = (date: string | undefined) => {
  if (!date) return ["", "", ""];

  const parts = date.split("--");
  if (parts.length !== 3) return ["", "", ""];

  const [a, b, c] = parts;

  if (a.length === 4) {
    return [a, b, c];
  }

  return [c, b, a];
};
