import api from "@/services/api";
import type { Class, NewClass } from "@classroom/shared";

export const getAllClasses = async (
  page = 1,
  limit = 5,
): Promise<{ fetchedClasses: Class[]; classesCount: number }> => {
  const {
    data: { fetchedClasses, classesCount },
  } = await api.get("/classes", { params: { page, limit } });
  return { fetchedClasses, classesCount };
};

export const getMyClasses = async (): Promise<{ myClasses: Class[] }> => {
  const {
    data: { myClasses },
  } = await api.get("/classes/me");
  return { myClasses };
};

export const getClassById = async (id: string | string[] | undefined): Promise<{foundClass: Class & { subjectName: string } }> => {
  const { data: foundClass } = await api.get(`/classes/${id}`);
  return { foundClass };
}

export const createClass = async (cls: NewClass): Promise<Class> => {
  const {data} = await api.post('/classes', cls);
  return data;
}


// assign a teacher to a class (by the admin)
export const assignTeacher = async (classId: string | string[] | undefined, teacherId: number) => {
  await api.patch(`/classes/${classId}`, teacherId);
}
