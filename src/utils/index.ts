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

  const parts = date.split("-");
  if (parts.length !== 3) return ["", "", ""];

  const [a, b, c] = parts;

  if (a.length === 4) {
    return [a, b, c];
  }

  return [c, b, a];
};

export const formatDateTime = (date: string | undefined): string => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export const calculateCursorPosition = (
  value: string,
  selectionStart: number,
  formatted: string,
): number => {
  const digitIndex = value.slice(0, selectionStart).replace(/\D/g, "").length;

  let pos = 0;
  let count = 0;
  while (count < digitIndex && pos < formatted.length) {
    if (/\d/.test(formatted[pos++])) count++;
  }
  return pos;
};

export const getProfilePhotoUrl = (profilePhoto: string | null) => {
  if (!profilePhoto) return undefined;
  return `data:image/jpeg;base64,${profilePhoto}`;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const toTitleCase = (str: string | undefined) =>
  !str
    ? ""
    : str
        .replace(/[_-]+/g, " ")
        .replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
        );
