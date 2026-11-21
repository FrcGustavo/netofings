import { fetchJson, HttpError } from './fetcher';
import { useAuthStore } from '../modules/auth/hooks/useAuthStore';
import { performTokenRefresh } from '../modules/auth/lib/refreshService';

export async function authorizedFetch<T>(
  path: string,
  options: any = {}
): Promise<T> {
  const { accessToken } = useAuthStore.getState();

  const authenticatedOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    return await fetchJson<T>(path, authenticatedOptions);
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      const newAccessToken = await performTokenRefresh();
      
      // Retry with new token
      const retriedOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      };
      
      return await fetchJson<T>(path, retriedOptions);
    }
    
    throw error;
  }
}
