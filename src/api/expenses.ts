import apiClient from './client';
import { Expense, ExpenseSummary } from '../types';

export const expensesApi = {
  list: (params?: { q?: string; category?: string; page?: number }) =>
    apiClient.get<Expense[]>('/expenses', { params }),

  summary: () => apiClient.get<ExpenseSummary>('/expenses/summary'),

  create: (payload: Partial<Expense>) => apiClient.post<Expense>('/expenses', payload),

  update: (id: number, payload: Partial<Expense>) =>
    apiClient.put<Expense>(`/expenses/${id}`, payload),

  remove: (id: number) => apiClient.delete(`/expenses/${id}`),
};
