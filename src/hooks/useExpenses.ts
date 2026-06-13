import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '../api/expenses';
import { Expense } from '../types';

export const useExpenses = (search = '') =>
  useInfiniteQuery({
    queryKey: ['expenses', search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await expensesApi.list({ q: search, page: pageParam });
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

export const useExpenseSummary = () =>
  useQuery({
    queryKey: ['expenses', 'summary'],
    queryFn: async () => {
      const { data } = await expensesApi.summary();
      return data;
    },
  });

export const useExpenseMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Partial<Expense>) => expensesApi.create(payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, ...payload }: Partial<Expense> & { id: number }) =>
      expensesApi.update(id, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return { create, update };
};
