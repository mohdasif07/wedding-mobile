import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { photosApi } from '../api/photos';

export const useAlbums = (search = '') =>
  useInfiniteQuery({
    queryKey: ['albums', search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await photosApi.albums({ q: search, page: pageParam });
      return {
        items: response.data,
        page: Number(response.headers['x-page'] || pageParam),
        totalCount: Number(response.headers['x-total-count'] || 0),
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length > 0 && lastPage.page * 20 < lastPage.totalCount
        ? lastPage.page + 1
        : undefined,
  });

export const useAlbum = (id: number) =>
  useQuery({
    queryKey: ['albums', id],
    queryFn: async () => {
      const { data } = await photosApi.album(id);
      return data;
    },
    enabled: !!id,
  });

export const usePhotos = (params: { event_id?: number; album_id?: number }) =>
  useInfiniteQuery({
    queryKey: ['photos', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await photosApi.list({ ...params, page: pageParam });
      return {
        items: response.data,
        page: Number(response.headers['x-page'] || pageParam),
        totalCount: Number(response.headers['x-total-count'] || 0),
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length > 0 && lastPage.page * 20 < lastPage.totalCount
        ? lastPage.page + 1
        : undefined,
  });

export const usePhotoUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => photosApi.upload(formData).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
};

export const useAlbumMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: { title: string; description?: string }) =>
      photosApi.createAlbum(payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['albums'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...payload }: { id: number; title: string; description?: string }) =>
      photosApi.updateAlbum(id, payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['albums'] }),
  });

  return { create, update };
};
