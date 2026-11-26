import api from '@/services/api';
import type { Subject, NewSubject } from '@classroom/shared';

export const getSubjects = async (page = 1, limit = 5, search = ""): Promise<{subs: Subject[], subjectsCount: number}> => {
  const { data: {subs, subjectsCount} } = await api.get(`/subjects`, {params: {page, limit, search: search || undefined}});
  return {subs, subjectsCount};
}

export const createSubject = async (sub: NewSubject): Promise<Subject> => {
  const { data } = await api.post('/subjects', sub);
  return data;
}
