import api from '@/services/api';

export const getAllDepartments = async (departmentsPath: string, page = 1, rows = 5) => {
  const { data } = await api.get(`/${departmentsPath}`, {params: {page, rows}});
  return data;
}
