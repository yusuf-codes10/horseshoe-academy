import api from '@/services/api';
import type { ClassDetail, Teacher, NewUser } from '@classroom/shared';

// assign a teacher to a class (by the admin)
export const assignTeacher = async (classId: string | string[] | undefined, teacherId: number): Promise<{ updatedClass: ClassDetail | null}> => {
  const { data: {updatedClass} } = await api.patch(`/teachers/${classId}`, teacherId);
  return { updatedClass };
}

// get teachers
export const getTeachers = async (  page = 1, limit = 5): Promise<{allTeachers: (Teacher & NewUser) [], teachersCount: number}> => {
  const { data: {allTeachers, teachersCount} } = await api.get("/teachers", { params: { page, limit } });
  return { allTeachers, teachersCount };
}

export const getTeacherById = async (teacherId: number): Promise<{ foundTeacher: (Teacher & NewUser)}> => {
  const { data: {foundTeacher}} = await api.get(`/teachers/${teacherId}`);
  return {foundTeacher};
}
