import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/api-client';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  warehousePrice?: number;
  exFactoryPrice?: number;
  exDestinationPrice?: number;
  images: string[];
  brand: string;
  modelNumber?: string;
  sku: string;
  unit: string;
  minimumOrder?: number;
  stockQuantity: number;
  origin?: string;
  warranty?: string;
  shippingDays?: string;
  retail?: number;
  wholesale?: number;
  bulkb2b?: number;
  productStatus?: string;
  color?: string;
  size?: string;
  thickness?: string;
  material?: string;
  dimensions?: string;
  categoryId: number;
  sellerId: number;
  stockStatus?: string | null;
  category?: {
    id: number;
    name?: string;
    title?: string;
  };
}

export interface Category {
  id: number;
  name?: string;
  title?: string;
  description?: string;
}

// --- Category Hooks ---
export const useCategories = (options?: any) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categories');
      return data.data as Category[];
    },
    ...options,
  });
};

// --- Product Hooks ---
export const useProducts = (filters?: any, options?: any) => {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/products', { params: filters });
      return data.data as Product[];
    },
    ...options,
  });
};

export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/products/${id}`);
      return data.data as Product;
    },
    enabled: !!id,
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const { data } = await apiClient.post('/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: FormData }) => {
      const { data } = await apiClient.put(`/products/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete(`/products/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateStockStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productIds, stockStatus }: { productIds: number[]; stockStatus: string }) => {
      const { data } = await apiClient.post('/products/stock-status', {
        productId: productIds,
        stockStatus: stockStatus,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
