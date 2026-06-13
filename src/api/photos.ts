import apiClient from './client';
import { Album, Photo } from '../types';

export const photosApi = {
  list: (params?: { event_id?: number; album_id?: number; page?: number }) =>
    apiClient.get<Photo[]>('/photos', { params }),

  albums: (params?: { q?: string; page?: number }) =>
    apiClient.get<Album[]>('/albums', { params }),

  album: (id: number) => apiClient.get<Album>(`/albums/${id}`),

  createAlbum: (payload: { title: string; description?: string }) =>
    apiClient.post<Album>('/albums', payload),

  updateAlbum: (id: number, payload: { title: string; description?: string }) =>
    apiClient.patch<Album>(`/albums/${id}`, payload),

  upload: (formData: FormData) => apiClient.post<Photo>('/photos', formData),

  remove: (id: number) => apiClient.delete(`/photos/${id}`),
};
