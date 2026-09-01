import api from '@/services/api';

export const getAllEnrollements = async (enrollmentsPath: string) => {
  const response = await api.get(`/${enrollmentsPath}`);
  return response;
}
