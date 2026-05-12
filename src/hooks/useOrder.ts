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
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: string;
  addressId: number | null;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  userId: number;
  quotationId: number | null;
  sellerId: number | null;
  paymentReceipt: string;
  vendorImage: string | null;
  items: OrderItem[];
  address: {
    id: number;
    fullName: string;
    phone: string;
    email: string;
    streetAddress: string;
    city: string;
    province: string;
    postalCode: string;
    label: string;
  } | null;
  user: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    shopName?: string | null;
    logo?: string | null;
  };

}

export interface OrderStats {
  Pending: number;
  Processing: number;
  Shipped: number;
  Delivered: number;
  Cancelled: number;
}

export interface OrdersResponse {
  statusCode: number;
  data: Order[];
  message: string;
  success: boolean;
  page: number;
  total: number;
  lastPage: number;
}

export const useOrders = (filters?: any, options?: any) => {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/orders', { params: filters });
      return data;
    },
    ...options
  });
};

export const useOrderDetails = (id: string | number) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/orders/${id}`);
      return data.data as Order;
    },
    enabled: !!id,
  });
};

export const useOrderStats = (filters?: any, options?: any) => {
  return useQuery<OrderStats>({
    queryKey: ['order-stats', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/orders/stats', { params: filters });
      return data.data as OrderStats;
    },
    ...options
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await apiClient.patch(`/api/orders/status/${id}`, { orderStatus: status });
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
      const { data } = await apiClient.patch(`/api/orders/vendor-image/${id}`, formData, {
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
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      paymentMethod: string;
      addressId: string | number;
      quotationId?: string | number;
      receipt?: File | null;
    }) => {
      const formData = new FormData();
      formData.append('paymentMethod', payload.paymentMethod);
      formData.append('addressId', payload.addressId.toString());
      
      if (payload.quotationId) {
        formData.append('quotationId', payload.quotationId.toString());
      }
      if (payload.receipt) {
        formData.append('receipt', payload.receipt);
      }
      
      const { data } = await apiClient.post('/api/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};
