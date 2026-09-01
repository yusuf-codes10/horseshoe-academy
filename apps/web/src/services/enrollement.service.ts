import api from '@/services/api';

export const getAllEnrollements = async (enrollmentsPath: string, page = 1, rows = 5) => {
  const { data } = await api.get(`/${enrollmentsPath}`, { params: {page, rows}});
  return data; // enrolls, count...
}
