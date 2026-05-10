import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/api-client';

export interface RegisterStep1Payload {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
}

const registerStep1 = async (payload: RegisterStep1Payload) => {
  // Use the axios instance which has the interceptors configured
  const { data } = await apiClient.post('/auth/register/step1', payload);
  return data;
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerStep1,
  });
};

export interface VerifyOtpStep2Payload {
  otp: string;
  phone: string;
}

const verifyOtpStep2 = async (payload: VerifyOtpStep2Payload) => {
  const { data } = await apiClient.post('/auth/register/step2', payload);
  return data;
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: verifyOtpStep2,
  });
};

export interface CompleteBusinessStep3Payload {
  shopName: string;
  logo?: File | null;
  shopCoverImage?: File | null;
  address?: string;
  accountType?: string;
  businessAddress?: string;
  warehouseAddress?: string;
  returnAddress?: string;
}

const completeBusinessStep3 = async (payload: CompleteBusinessStep3Payload) => {
  const formData = new FormData();
  formData.append('shopName', payload.shopName);
  if (payload.logo) formData.append('logo', payload.logo);
  if (payload.shopCoverImage) formData.append('shopCoverImage', payload.shopCoverImage);
  if (payload.address) formData.append('address', payload.address);
  if (payload.accountType) formData.append('accountType', payload.accountType);
  if (payload.businessAddress) formData.append('businessAddress', payload.businessAddress);
  if (payload.warehouseAddress) formData.append('warehouseAddress', payload.warehouseAddress);
  if (payload.returnAddress) formData.append('returnAddress', payload.returnAddress);

  const { data } = await apiClient.post('/auth/register/step3', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const useCompleteBusinessStep3Mutation = () => {
  return useMutation({
    mutationFn: completeBusinessStep3,
  });
};

export interface CompleteDocumentsStep4Payload {
  accountTitle?: string;
  branchCode?: string;
  accountNumber?: string;
  ibanNumber?: string;
}

const completeDocumentsStep4 = async (payload: CompleteDocumentsStep4Payload) => {
  const { data } = await apiClient.post('/auth/register/step4', payload);
  return data;
};

export const useCompleteDocumentsStep4Mutation = () => {
  return useMutation({
    mutationFn: completeDocumentsStep4,
  });
};

export interface LoginPayload {
  identifier: string;
  password?: string;
}

const login = async (payload: LoginPayload) => {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
  });
};
