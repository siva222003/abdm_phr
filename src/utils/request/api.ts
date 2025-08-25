import { HttpMethod } from "./types";

function Type<T>(): T {
  return {} as T;
}

export const API = <TResponse, TBody = undefined>(
  route: `${HttpMethod} ${string}`,
  noAuth: boolean = false,
) => {
  const [method, path] = route.split(" ") as [HttpMethod, string];
  return {
    path,
    method,
    noAuth,
    TRes: Type<TResponse>(),
    TBody: Type<TBody>(),
  };
};
