import api from '@/services/api';
import type { NewSession } from '@classroom/shared';

export const createSession = async (classId: string | string[] | undefined, session: NewSession) => {
  const { data} = await api.post(`/classes/${classId}/sessions`, session);
  return data;
}

export const getSessionsByClass = async (classId: string | string[] | undefined) => {
  const { data: { foundSessions } } = await api.get(`/classes/${classId}/sessions`);
  return { foundSessions };
}
