import apiClient from './client';
import { Vendor } from '../types';

export const vendorsApi = {
  list: (params?: { q?: string; vendor_type?: string; page?: number }) =>
    apiClient.get<Vendor[]>('/vendors', { params }),

  get: (id: number) => apiClient.get<Vendor>(`/vendors/${id}`),

  create: (payload: Partial<Vendor>) => apiClient.post<Vendor>('/vendors', payload),

  update: (id: number, payload: Partial<Vendor>) =>
    apiClient.put<Vendor>(`/vendors/${id}`, payload),

  remove: (id: number) => apiClient.delete(`/vendors/${id}`),
};
