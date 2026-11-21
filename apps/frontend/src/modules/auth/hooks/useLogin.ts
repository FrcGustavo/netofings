import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/authApi';
import { useAuthStore } from './useAuthStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.access_token, data.refresh_token, data.user);
      navigate('/');
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      // You could handle specific errors here
    }
  });
};
