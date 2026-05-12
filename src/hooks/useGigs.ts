import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/api-client';

export interface Gig {
  id: number;
  title: string;
  description: string;
  price: string;
  price_type: string;
  city: string;
  areaCoverage: string;
  availability: string;
  experieceYear: string;
  minProjectSize: string;
  deliveryDays: string;
  gigStatus: string;
  qualification: string;
  gigCategoriesId: number;
  images: string[];
  status?: string;
  category?: {
    id: number;
    title: string;
    status: string;
  };
  user?: {
    fullName: string;
    email: string;
    role: string;
    phone?: string;
    logo?: string;
    shopName?: string;
    businessAddress?: string;
  };
}

export interface GigCategory {
  id: number;
  title: string;
  description: string;
  image: string;
  status: string;
}

export interface GigsResponse {
  statusCode: number;
  data: Gig[];
  message: string;
  success: boolean;
  page: number;
  total: number;
  lastPage: number;
}

export const useCreateGigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const { data } = await apiClient.post('/gigs', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
};

export const useUpdateGigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number | string; payload: FormData }) => {
      const { data } = await apiClient.put(`/gigs/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
};

export const useDeleteGigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      const { data } = await apiClient.delete(`/gigs/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
};

export const useGigs = (filters?: any) => {
  return useQuery<GigsResponse>({
    queryKey: ['gigs', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/gigs', { params: filters });
      return data;
    },
  });
};

export const useGig = (id: number | string | undefined) => {
  return useQuery<{ data: Gig }>({
    queryKey: ['gig', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/gigs/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useGigCategories = () => {
  return useQuery<GigCategory[]>({
    queryKey: ['gig-categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/gig-categories');
      return data.data;
    },
  });
};
