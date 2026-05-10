import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/api-client';

export interface OrderItem {
  id: number;
  quantity: number;
  priceAtPurchase: string;
  totalItemPrice: string;
  product: {
    id: number;
    title: string;
    images: string[];
    brand: string;
    unit: string;
  };
}

export interface Order {
  id: number;
  totalAmount: string;
  shippingAddress: string;
  billingAddress: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  vendorImage: string | null;
  items: OrderItem[];
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface OrderStats {
  Pending: number;
  Processing: number;
  Shipped: number;
  Delivered: number;
  Cancelled: number;
}

export const useOrders = (filters?: any) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/orders', { params: filters });
      return data; // Returns { data: Order[], total, page, lastPage }
    },
  });
};

export const useOrderStats = (filters?: any) => {
  return useQuery({
    queryKey: ['order-stats', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/orders/stats', { params: filters });
      return data.data as OrderStats;
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await apiClient.patch(`/orders/${id}`, { orderStatus: status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
};

export const useUploadOrderImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, image }: { id: number; image: File }) => {
      const formData = new FormData();
      formData.append('vendorImage', image);
      const { data } = await apiClient.patch(`/orders/vendor-image/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
};
