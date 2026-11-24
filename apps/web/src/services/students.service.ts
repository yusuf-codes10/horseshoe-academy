import api from '@/services/api';
import type { Student, NewUser } from '@classroom/shared';

// get teachers
export const getStudents = async (  page = 1, limit = 5): Promise<{allStudents: (Student & NewUser) [], studentsCount: number}> => {
  const { data: {allStudents, studentsCount} } = await api.get("/students", { params: { page, limit } });
  return { allStudents, studentsCount };
}
