import api from './api';
import { AuthResponse, User } from '../types';

const login = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

const register = async (username: string, email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/register', {
    name: username,
    email,
    password,
  });
  return response.data;
};

const updateProfile = async (userId: string, data: { name?: string }): Promise<{ message: string, user: Partial<User> }> => {
  const response = await api.patch<{ message: string, user: Partial<User> }>(`/users/${userId}`, data);
  return response.data;
};

const changePassword = async (passwordData: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(`/users/change-password`, passwordData);
  return response.data;
};

export const authService = {
  login,
  register,
  updateProfile,
  changePassword,
};