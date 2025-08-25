import { useQueryParams as _useQueryParams } from "raviger";

type QueryParams = Record<string, unknown>;

interface UseQueryParamsOptions {
  limit: number;
  includePage?: boolean;
}

export function useQueryParams({
  limit,
  includePage = true,
}: UseQueryParamsOptions) {
  const [qParams, setQParams] = _useQueryParams();

  const updateQuery = (params: Partial<QueryParams>) => {
    setQParams(
      {
        limit,
        ...(includePage && { page: 1 }),
        ...qParams,
        ...params,
      },
      { overwrite: true, replace: true },
    );
  };

  return {
    params: qParams,
    updateQuery,
  };
}
