import api from '@/services/api';

export const getAllEnrollements = async (enrollmentsPath: string) => {
  const { data } = await api.get(`/${enrollmentsPath}`);
  return data; // enrolls, count...
}
