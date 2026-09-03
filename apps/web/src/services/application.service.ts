import api from '@/services/api';

export const applyToClass = async (classId: string | string[] | undefined) => {
  const { data } = await api.post(`/classes/${classId}/applications`);
  return data;
}
