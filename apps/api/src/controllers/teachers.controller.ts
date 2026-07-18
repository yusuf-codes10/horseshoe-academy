import { createFactory } from "hono/factory";
import type { NewTeacher } from "@classroom/shared";
import { teachers, users } from "@/db/schema";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { teacher: NewTeacher } }>();

export const getAllTeacher = factory.createHandlers(async (c) => {
  try {
    const allTeachers = await db
      .select({
        id: teachers.id,
        username: users.username,
        email: users.email,
        gender: users.gender,
        fullName: users.fullName,
        role: users.role,
        createdAt: users.createdAt,
        degree: teachers.degree,
        major: teachers.major,
        salary: teachers.salary,
      })
      .from(teachers)
      .innerJoin(users, eq(users.id, teachers.id));
    return c.json({ msg: "teachers: ", allTeachers });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// get teacher by id
export const getTeacherById = factory.createHandlers(async (c) => {
  const teacherId = Number(c.req.param("teacherId"));
  try {
    const [foundTeacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, teacherId));

      if (!foundTeacher) throw new HTTPException(404, { message: "Teacher not found!" });
    return c.json({ msg: "Found Teacher: ", foundTeacher });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
