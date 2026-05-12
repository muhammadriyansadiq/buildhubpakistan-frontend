import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/api-client';

export interface User {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Vendor' | 'User' | 'Service Provider';
  phone: string;
  isPhoneVerified: boolean;
  shopName?: string | null;
  logo?: string | null;
  shopCoverImage?: string | null;
  address?: string | null;
  accountType?: string | null;
  cnicNumber?: string | null;
  ntnNumber?: string | null;
  businessAddress?: string | null;
  warehouseAddress?: string | null;
  returnAddress?: string | null;
  accountTitle?: string | null;
  branchCode?: string | null;
  accountNumber?: string | null;
  ibanNumber?: string | null;
  isProfileComplete: boolean;
  isVerified: boolean;
  isApproved?: 'Pending' | 'Approved' | 'Rejected' | null;
  onboardingStep: number;
  tier?: string | null;
  receipt?: string | null;
  addresses?: any[];
}

export interface UsersResponse {
  statusCode: number;
  data: User[];
  message: string;
  success: boolean;
  page: number;
  total: number;
  lastPage: number;
}

export const useUsers = (filters: { role?: string; limit?: number; page?: number; isApproved?: string } = {}, options?: any) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/users', { params: filters });
      return data;
    },
    ...options
  });
};

export const useUserById = (id: number | null) => {
  return useQuery<{ statusCode: number; data: User; message: string; success: boolean }>({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number | string; payload: any }) => {
      const { data } = await apiClient.put(`/users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
