import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/api-client';

export enum QuotationStatus {
  All = "All",
  Pending = "Pending",
  Quoted = "Quoted",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

export interface QuotationResponse {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  reply: string;
  responseBy: string;
  userId: number;
  quotationId: number;
  quotationStatus: string;
}

export interface Quotation {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  requiredQuantity: number;
  deliveryLocation: string;
  additionalRequirement: string;
  productId: number | null;
  serviceGigId: number | null;
  userId: number;
  product?: any;
  serviceGig?: any;
  responses: QuotationResponse[];
  user: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    [key: string]: any;
  };
}

export interface QuotationStats {
  Pending: number;
  Quoted: number;
  Accepted: number;
  Rejected: number;
}

// --- Quotation Hooks ---

export const useQuotations = (filters?: any) => {
  return useQuery({
    queryKey: ['quotations', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/quotations', { params: filters });
      return data; // Returns the full pagination object
    },
  });
};

export const useQuotationDetails = (id: number | string | null) => {
  return useQuery({
    queryKey: ['quotation', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/quotations/${id}`);
      return data.data as Quotation;
    },
    enabled: !!id,
  });
};

export const useQuotationStats = (filters?: any) => {
  return useQuery({
    queryKey: ['quotation-stats', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/quotations/stats', { params: filters });
      return data.data as QuotationStats;
    },
  });
};

export const useUpdateQuotationStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number | string; status: string }) => {
      const { data } = await apiClient.patch(`/quotations/status/${id}`, {
        quotationStatus: status,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation-stats'] });
    },
  });
};

// If there's an API to send a reply/price (Quoted status)
export const useRespondToQuotationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, price, reply }: { id: number | string; price: number; reply: string }) => {
      // The user didn't specify the exact endpoint for sending a quote response, 
      // but usually it's a POST to responses or similar.
      // Based on common patterns in this project:
      const { data } = await apiClient.post(`/quotations/respond/${id}`, {
        price,
        reply,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation'] });
    },
  });
};
