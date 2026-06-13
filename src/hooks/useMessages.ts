import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../api/messages';

export const useMessages = (eventId?: number) =>
  useInfiniteQuery({
    queryKey: ['messages', eventId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await messagesApi.list({ event_id: eventId, page: pageParam });
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

export const useMessage = (id: number) =>
  useQuery({
    queryKey: ['messages', id],
    queryFn: async () => {
      const { data } = await messagesApi.get(id);
      return data;
    },
    enabled: !!id,
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.send,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });
};
