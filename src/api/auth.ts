import apiClient from './client';
import { AuthTokens, User } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/login', { email, password }),

  register: (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }) => apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/register', payload),

  logout: (refreshToken?: string) =>
    apiClient.post('/auth/logout', { refresh_token: refreshToken }),

  profile: () => apiClient.get<User>('/profile'),

  updateProfile: (payload: Partial<Pick<User, 'first_name' | 'last_name' | 'phone'>> & {
    password?: string;
    password_confirmation?: string;
  }) => apiClient.patch<User>('/profile', payload),
};
