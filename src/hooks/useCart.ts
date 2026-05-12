import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/api-client';

export interface CartItem {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  productId: number;
  userId: number;
  quantity: number;
  totalPrice: string;
  product: {
    id: number;
    title: string;
    price: string;
    images: string[];
    user: {
      fullName: string;
      email: string;
      shopName: string;
    };
  };
}

export const useCart = (options?: any) => {
  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await apiClient.get('/cart');
      return data.data as CartItem[];
    },
    ...options
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const { data } = await apiClient.post('/cart', { productId, quantity });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartQuantityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const { data } = await apiClient.put(`/cart/${id}`, { quantity });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete(`/cart/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
