import apiClient from './client';
import { DashboardStats } from '../types';

export const dashboardApi = {
  stats: () => apiClient.get<DashboardStats>('/dashboard'),
};
