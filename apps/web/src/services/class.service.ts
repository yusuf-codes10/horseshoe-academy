import api from "@/services/api";
import type { Class } from "@classroom/shared";

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
