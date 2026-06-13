import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { guestsApi } from '../api/guests';
import { Guest } from '../types';

export const useGuests = (
  eventId: number,
  filters: { q?: string; rsvp_status?: string; side?: string } = {}
) =>
  useInfiniteQuery({
    queryKey: ['guests', eventId, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await guestsApi.list(eventId, { ...filters, page: pageParam });
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
    enabled: !!eventId,
  });

export const useGuest = (eventId: number, guestId: number) =>
  useQuery({
    queryKey: ['guests', eventId, guestId],
    queryFn: async () => {
      const { data } = await guestsApi.get(eventId, guestId);
      return data;
    },
    enabled: !!eventId && !!guestId,
  });

export const useGuestMutations = (eventId: number) => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Partial<Guest>) =>
      guestsApi.create(eventId, payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guests', eventId] }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...payload }: Partial<Guest> & { id: number }) =>
      guestsApi.update(eventId, id, payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guests', eventId] }),
  });

  const updateRsvp = useMutation({
    mutationFn: ({ guestId, status }: { guestId: number; status: string }) =>
      guestsApi.updateRsvp(eventId, guestId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guests', eventId] }),
  });

  return { create, update, updateRsvp };
};
