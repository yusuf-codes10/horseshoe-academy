import api from '@/services/api';
import type { Subject } from '@classroom/shared';

export const getSubjects = async (page = 1, limit = 5): Promise<{subs: Subject[], subjectsCount: number}> => {
  const { data: {subs, subjectsCount} } = await api.get('/subjects', {params: {page, limit}});
  return {subs, subjectsCount};
}
