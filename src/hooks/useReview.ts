import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/api-client';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  productId: number;
  user: {
    fullName: string;
    phone: string;
    [key: string]: any;
  };
  product?: any;
  [key: string]: any;
}

export const useReviews = (filters?: { userId?: number; productId?: number; sellerId?: number }) => {
  return useQuery({
    queryKey: ['reviews', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/reviews', { params: filters });
      return data.data as Review[];
    },
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { productId: number; sellerId: number; rating: number; comment: string }) => {
      const { data } = await apiClient.post('/api/reviews', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
