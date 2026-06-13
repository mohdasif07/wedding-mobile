import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api/events';
import { Event } from '../types';

export const useEvents = (search = '', status = '') =>
  useInfiniteQuery({
    queryKey: ['events', search, status],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await eventsApi.list({ q: search, status, page: pageParam });
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

export const useEvent = (id: number) =>
  useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const { data } = await eventsApi.get(id);
      return data;
    },
    enabled: !!id,
  });

export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Partial<Event>) => eventsApi.create(payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...payload }: Partial<Event> & { id: number }) =>
      eventsApi.update(id, payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => eventsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  return { create, update, remove };
};
