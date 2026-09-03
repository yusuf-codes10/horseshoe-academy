import api from '@/services/api';
// import type { Enrollement } from '@classroom/shared';

export const getAllEnrollements = async (enrollmentsPath: string, page = 1, rows = 5) => {
  const { data: {enrolledStudents} } = await api.get(`/${enrollmentsPath}`, { params: {page, rows}});
  return {enrolledStudents}; // enrolls, count...
}
