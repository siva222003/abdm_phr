import "@tanstack/react-query";

type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>;

export type QueryParams = Record<string, QueryParamValue>;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRoute<TData, TBody = unknown> {
  baseUrl?: string;
  method?: HttpMethod;
  TBody?: TBody;
  path: string;
  TRes: TData;
  noAuth?: boolean;
}

type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}{${infer Param}}${infer Rest}`
    ? Param | ExtractRouteParams<Rest>
    : never;

type PathParams<T extends string> = {
  [_ in ExtractRouteParams<T>]: string;
};

export interface ApiCallOptions<Route extends ApiRoute<unknown, unknown>> {
  pathParams?: PathParams<Route["path"]>;
  queryParams?: QueryParams;
  body?: Route["TBody"];
  silent?: boolean;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export type StructuredError = Record<string, string | string[]>;

type HTTPErrorCause = StructuredError | Record<string, unknown> | undefined;

export class HTTPError extends Error {
  status: number;
  silent: boolean;
  cause?: HTTPErrorCause;

  constructor({
    message,
    status,
    silent,
    cause,
  }: {
    message: string;
    status: number;
    silent: boolean;
    cause?: Record<string, unknown>;
  }) {
    super(message, { cause });
    this.status = status;
    this.silent = silent;
    this.cause = cause;
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: HTTPError;
  }
}

export interface PaginatedResponse<TItem> {
  count: number;
  results: TItem[];
}
