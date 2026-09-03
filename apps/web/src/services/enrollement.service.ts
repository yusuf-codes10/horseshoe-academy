import api from '@/services/api';
import type { NewUser } from '@classroom/shared';

// type EnrolledStudent = Pick<NewUser, 'id' | 'fullName' | 'username'>;

export const getAllEnrollments = async (enrollementPath: string, page = 1, limit = 5) => {
  const { data: { enrolls, count } } = await api.get(`${enrollementPath}`, { params: { page, limit } });
  return { enrolls, count };
}

export const getEnrolledStudentsByClass = async (classId: string | string[] | undefined): Promise<{ enrolledStudents: NewUser[] }> => {
  const { data: { enrolledStudents } } = await api.get(`/enrollements/${classId}`);
  return { enrolledStudents };
}
