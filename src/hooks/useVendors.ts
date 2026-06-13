import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vendorsApi } from '../api/vendors';
import { Vendor } from '../types';

export const useVendors = (search = '') =>
  useInfiniteQuery({
    queryKey: ['vendors', search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await vendorsApi.list({ q: search, page: pageParam });
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

export const useVendor = (id: number) =>
  useQuery({
    queryKey: ['vendors', id],
    queryFn: async () => {
      const { data } = await vendorsApi.get(id);
      return data;
    },
    enabled: !!id,
  });

export const useVendorMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Partial<Vendor>) => vendorsApi.create(payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...payload }: Partial<Vendor> & { id: number }) =>
      vendorsApi.update(id, payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });

  return { create, update };
};
