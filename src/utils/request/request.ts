import { HTTPError } from "@/utils/request/types";
import type { ApiCallOptions, ApiRoute } from "@/utils/request/types";
import { getResponseBody, makeHeaders, makeUrl } from "@/utils/request/utils";

async function callApi<Route extends ApiRoute<unknown, unknown>>(
  { path, method, noAuth }: Route,
  options?: ApiCallOptions<Route>,
): Promise<Route["TRes"]> {
  const baseUrl = import.meta.env.REACT_CARE_API_URL;
  const url = `${baseUrl}${makeUrl(path, options?.queryParams, options?.pathParams)}`;

  const fetchOptions: RequestInit = {
    method,
    headers: makeHeaders(noAuth ?? false, options?.headers),
    signal: options?.signal,
  };

  if (options?.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  let res: Response;

  try {
    res = await fetch(url, fetchOptions);
  } catch {
    throw new Error("Network Error");
  }

  const data = await getResponseBody<Route["TRes"]>(res);

  if (!res.ok) {
    const isSilent = options?.silent ?? false;

    throw new HTTPError({
      message: "Request Failed",
      status: res.status,
      silent: isSilent,
      cause: data as unknown as Record<string, unknown>,
    });
  }

  return data;
}

export function query<Route extends ApiRoute<unknown, unknown>>(
  route: Route,
  options?: ApiCallOptions<Route>,
) {
  return ({ signal }: { signal: AbortSignal }) => {
    return callApi(route, { ...options, signal });
  };
}

export function mutate<Route extends ApiRoute<unknown, unknown>>(
  route: Route,
  options?: ApiCallOptions<Route>,
) {
  return (variables: Route["TBody"]) => {
    return callApi(route, { ...options, body: variables });
  };
}
