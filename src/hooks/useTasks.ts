import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { Task } from '../types';

export const useTasks = (category = '') =>
  useInfiniteQuery({
    queryKey: ['tasks', category],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await tasksApi.list({ category, page: pageParam });
      return {
        items: response.data,
        page: Number(response.headers['x-page'] || pageParam),
        totalCount: Number(response.headers['x-total-count'] || 0),
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length > 0 && lastPage.page * 50 < lastPage.totalCount
        ? lastPage.page + 1
        : undefined,
  });

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Partial<Task>) => tasksApi.create(payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...payload }: Partial<Task> & { id: number }) =>
      tasksApi.update(id, payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => tasksApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return { create, update, remove };
};
