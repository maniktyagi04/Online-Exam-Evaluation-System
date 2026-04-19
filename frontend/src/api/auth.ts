import apiClient from './client';
import type { User } from '../types';

interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export const registerApi = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/auth/register', { name, email, password });
  return res.data;
};

export const loginApi = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return res.data;
};
