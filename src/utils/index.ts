import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { LocalStorageKeys } from "@/common/constants";

dayjs.extend(utc);

type DateLike = Parameters<typeof dayjs>[0];

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

export const dateQueryString = (
  date: DateLike,
  withTime: boolean = false,
): string => {
  const parsed =
    typeof date === "string"
      ? dayjs(date, ["DD-MM-YYYY", "YYYY-MM-DD"], true)
      : dayjs(date);

  if (!parsed.isValid()) return "";
  return parsed.format(withTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD");
};

export const toIsoUtcString = (date: DateLike): string => {
  if (!date || !dayjs(date).isValid()) return "";
  return dayjs.utc(date).toISOString();
};

export const formatReadableDateTime = (
  date: DateLike,
  showTime: boolean = false,
): string => {
  if (!date || !dayjs(date).isValid()) return "";
  return dayjs(date).format(showTime ? "MMM D, YYYY h:mm A" : "MMM D, YYYY");
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
