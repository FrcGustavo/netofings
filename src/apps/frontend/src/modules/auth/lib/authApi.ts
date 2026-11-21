import { fetchJson } from '../../../lib/fetcher';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: any;
}

export interface RefreshResponse {
  access_token: string;
}

export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    fetchJson<LoginResponse>('/auth/login', {
      method: 'POST',
      baseUrl: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),
    
  signup: (userData: { name: string; email: string; password: string }) =>
    fetchJson<any>('/users', {
      method: 'POST',
      baseUrl: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }),
    
  refresh: (refreshToken: string) =>
    fetchJson<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      baseUrl: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    })
};
