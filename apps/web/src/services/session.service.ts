import api from '@/services/api';

export const createSession = async (classId: string | string[] | undefined) => {
  await api.post(`/classes/${classId}/sessions`);
}
