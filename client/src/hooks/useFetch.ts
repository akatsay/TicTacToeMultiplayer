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
      const baseUrl = '74.208.237.140:5000';
      const fullUrl = baseUrl + url;
      setLoading(true);
      try {
        if (options.body) {
          options.body = JSON.stringify(options.body);
          options.headers = { ...options.headers, 'Content-Type': 'application/json' };
        }

        const response = await fetch(fullUrl, options);
        const data = await response.json();
        if (!response.ok) {
          console.warn('hook says:' + data.message);
          // it might be an array or just string
          if (Array.isArray(data.message)) {
            throw new Error(data.message[0]);
          } else if (typeof data.message === 'string') {
            throw new Error(data.message);
          } else {
            throw new Error('Unknown request error');
          }
        }
        setLoading(false);
        return data as T;
      } catch (e: any) {
        console.warn('error in hook says: ' + e.message);
        setLoading(false);
        setError({ message: e.message.split('$')[1], cause: e.message.split('$')[0] });
        throw e;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { loading, request, error, clearError } as IFetchResult<T>;
};