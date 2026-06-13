import apiClient from './client';
import { Task } from '../types';

export const tasksApi = {
  list: (params?: { category?: string; page?: number }) =>
    apiClient.get<Task[]>('/tasks', { params }),

  create: (payload: Partial<Task>) => apiClient.post<Task>('/tasks', payload),

  update: (id: number, payload: Partial<Task>) =>
    apiClient.patch<Task>(`/tasks/${id}`, payload),

  remove: (id: number) => apiClient.delete(`/tasks/${id}`),
};
