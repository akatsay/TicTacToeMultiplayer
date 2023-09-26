import { useState, useCallback } from 'react';

interface IServerErrorDetails {
  message?: string;
  cause?: string;
}

interface IRequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

interface IFetchResult<T> {
  loading: boolean;
  error: IServerErrorDetails | null;
  request: (url: string, options?: IRequestOptions) => Promise<T>;
  clearError: () => void;
}

export const useFetch = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IServerErrorDetails | null>(null);

  const request = useCallback(
    async (url: string, options: IRequestOptions = {}) => {
      setLoading(true);
      try {
        if (options.body) {
          options.body = JSON.stringify(options.body);
          options.headers = { ...options.headers, 'Content-Type': 'application/json' };
        }

        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
          if (data.message) {
            setError({ message: data.error.message, cause: data.error.cause });
          }
        }
        setLoading(false);
        return data as T;
      } catch (e: any) {
        setLoading(false);
        throw e;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { loading, request, error, clearError } as IFetchResult<T>;
};