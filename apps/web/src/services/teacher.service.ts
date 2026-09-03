import api from '@/services/api';
import type { ClassDetail } from '@classroom/shared';

// assign a teacher to a class (by the admin)
export const assignTeacher = async (classId: string | string[] | undefined, teacherId: number): Promise<{ updatedClass: ClassDetail | null}> => {
  const { data: updatedClass } = await api.patch(`/teachers/${classId}`, teacherId);
  return { updatedClass };
}
