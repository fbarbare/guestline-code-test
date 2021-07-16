import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import * as t from 'io-ts';
import { send, HttpRequest } from './http';

type Return<Data, Error> = SWRResponse<Data, Error> &
  (
    | Readonly<{ data: undefined; error: undefined; isLoading: true }>
    | Readonly<{
        data: Data;
        error: undefined;
        isLoading: false;
      }>
    | Readonly<{ data: undefined; error: Error; isLoading: false }>
  );

const MAX_RETRY_COUNT = 3;
const RETRY_TIME = 5000;
const defaultConfig: SWRConfiguration = {
  onErrorRetry: (error: any, key, option, revalidate, { retryCount }) => {
    if (
      error.status === 400 ||
      error.status === 401 ||
      error.status === 403 ||
      error.status === 404
    )
      return;
    if (retryCount && retryCount >= MAX_RETRY_COUNT) return;

    setTimeout(() => revalidate({ retryCount: retryCount ? retryCount + 1 : 1 }), RETRY_TIME);
  },
  errorRetryCount: MAX_RETRY_COUNT,
  revalidateOnFocus: false
};

export default function useRequest<Data = unknown, E = Error & { status?: number }>(
  type: t.Type<Data, any, unknown>,
  requestOrUrl: HttpRequest | string,
  config: SWRConfiguration<Data, E> = {},
  shouldFetch: boolean = true
): Return<Data, E> {
  const key = typeof requestOrUrl === 'string' ? requestOrUrl : JSON.stringify(requestOrUrl);
  const httpRequest: HttpRequest =
    typeof requestOrUrl === 'string' ? { url: requestOrUrl, method: 'GET' } : requestOrUrl;

  const { data, error, isValidating, revalidate, mutate } = useSWR<Data, E>(
    shouldFetch ? key : null,
    () => send(type, httpRequest),
    { ...defaultConfig, ...config }
  );

  if (data) {
    return {
      mutate,
      data,
      error: undefined,
      isLoading: false,
      isValidating,
      revalidate
    };
  } else if (error) {
    return {
      mutate,
      data: undefined,
      isLoading: false,
      error,
      isValidating,
      revalidate
    };
  }
  return {
    mutate,
    data: undefined,
    error: undefined,
    isLoading: true,
    isValidating,
    revalidate
  };
}
