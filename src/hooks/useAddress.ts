import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/api-client';

export interface Address {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  province: string;
  postalCode: string;
  streetAddress: string;
  label: string;
}

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/addresses');
      return data.data as Address[];
    },
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: Omit<Address, 'id'>) => {
      const { data } = await apiClient.post('/api/addresses', address);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
