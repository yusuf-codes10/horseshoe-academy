import api from '@/services/api';
import type { NewDepartment } from '@classroom/shared';

export const getAllDepartments = async (departmentsPath: string, page = 1, limit = 5) => {
  const { data } = await api.get(`/${departmentsPath}`, {params: {page, limit}});
  return data;
}

export const createDep = async (dep: NewDepartment) => {
  const response = await api.post('/departments', dep);
  return response;
}
