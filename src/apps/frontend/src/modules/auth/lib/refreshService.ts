import { useAuthStore } from '../hooks/useAuthStore';
import { authApi } from './authApi';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

export const performTokenRefresh = async () => {
  if (isRefreshing) {
    return new Promise<string>((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  const { refreshToken, setAccessToken, logout } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    throw new Error('No refresh token available');
  }

  isRefreshing = true;

  try {
    const data = await authApi.refresh(refreshToken);
    setAccessToken(data.access_token);
    onTokenRefreshed(data.access_token);
    return data.access_token;
  } catch (error) {
    logout();
    throw error;
  } finally {
    isRefreshing = false;
  }
};
