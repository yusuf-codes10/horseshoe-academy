import api from '@/services/api';
import type { Subject, NewSubject } from '@classroom/shared';

export const getSubjects = async (page = 1): Promise<Subject[]> => {
  const { data } = await api.get('/subjects', {params: {page}});
  return data;
}
