import { createFactory } from "hono/factory";
import type { NewStudent } from "@classroom/shared";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { students, users } from "@/db/schema";

const factory = createFactory<{ Variables: { teacher: NewStudent } }>();

export const getAllStudents = factory.createHandlers(async (c) => {
  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 10;
  const skip = (page - 1) * limit;

  const allStudents = await db
    .select({
      id: students.id,
      username: users.username,
      email: users.email,
      gender: users.gender,
      fullName: users.fullName,
      role: users.role,
      createdAt: users.createdAt,
      avatarPublicId: users.avatarPublicId,
      avatarUrl: users.avatarUrl,
      gpa: students.gpa,
    })
    .from(students)
    .innerJoin(users, eq(users.id, students.id))
    .offset(skip)
    .limit(limit)
    .orderBy(students.id);
  return c.json({ msg: "all Students...", allStudents });
});
