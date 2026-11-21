import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/authApi';

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      // After signup, we usually redirect to login or auto-login
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('Signup failed:', error);
    }
  });
};
