import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/register', {
      name: username,
      email,
      password,
    });
    return response.data;
  },
};