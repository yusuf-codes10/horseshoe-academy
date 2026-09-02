import api from '@/services/api';

export const getAllClasses = async (page = 1, limit = 5) => {
  const {data} = await api.get('/classes', {params: {page, limit}});
  return data;
}
