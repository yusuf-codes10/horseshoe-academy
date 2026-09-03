import api from '@/services/api';
import type { ClassDetail, Teacher, NewUser } from '@classroom/shared';

// assign a teacher to a class (by the admin)
export const assignTeacher = async (classId: string | string[] | undefined, teacherId: number): Promise<{ updatedClass: ClassDetail | null}> => {
  const { data: updatedClass } = await api.patch(`/teachers/${classId}`, teacherId);
  return { updatedClass };
}

// get teachers
export const getTeachers = async (): Promise<{allTeachers: (Teacher & NewUser) []}> => {
  const { data: allTeachers } = await api.get('/teachers');
  return { allTeachers };
}

export const getTeacherById = async (teacherId: number) => {
  const { data: foundTeacher} = await api.get(`/teachers/${teacherId}`);
  return {foundTeacher};
}
