import type { Dispatch, SetStateAction } from "react";

import { LocalStorageKeys } from "@/common/constants";

import type { QueryParams } from "@/utils/request/types";

export function makeUrl(
  path: string,
  query?: QueryParams,
  pathParams?: Record<string, string | number>,
) {
  if (pathParams) {
    path = Object.entries(pathParams).reduce(
      (acc, [key, value]) => acc.replace(`{${key}}`, `${value}`),
      path,
    );
  }

  if (query) {
    path += `?${makeQueryParams(query)}`;
  }

  return path;
}

const makeQueryParams = (query: QueryParams) => {
  const qParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => qParams.append(key, `${v}`));
      return;
    }

    qParams.set(key, `${value}`);
  });

  return qParams.toString();
};

export function makeHeaders(noAuth: boolean, additionalHeaders?: HeadersInit) {
  const headers = new Headers(additionalHeaders);

  headers.set("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  const authorizationHeader = getAuthorizationHeader();
  if (authorizationHeader && !noAuth) {
    headers.set("Authorization", authorizationHeader);
  }

  return headers;
}

export function getAuthorizationHeader() {
  const accessToken = localStorage.getItem(LocalStorageKeys.accessToken);

  if (accessToken) {
    return `Bearer ${accessToken}`;
  }

  return null;
}

export async function getResponseBody<TData>(res: Response): Promise<TData> {
  if (!(res.headers.get("content-length") !== "0")) {
    return null as TData;
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const isImage = res.headers.get("content-type")?.includes("image");

  if (isImage) {
    return (await res.blob()) as TData;
  }

  if (!isJson) {
    return (await res.text()) as TData;
  }

  try {
    return await res.json();
  } catch {
    return (await res.text()) as TData;
  }
}

export function handleUploadPercentage(
  event: ProgressEvent,
  setUploadPercent: Dispatch<SetStateAction<number>>,
) {
  if (event.lengthComputable) {
    const percentComplete = Math.round((event.loaded / event.total) * 100);
    setUploadPercent(percentComplete);
  }
}
