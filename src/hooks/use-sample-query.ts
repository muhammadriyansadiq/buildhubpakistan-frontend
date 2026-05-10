import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/api-client';

// Example fetcher function
const fetchUsers = async () => {
  const { data } = await apiClient.get('/users');
  return data;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
