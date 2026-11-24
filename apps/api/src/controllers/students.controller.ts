import { createFactory } from "hono/factory";
import type { NewStudent } from "@classroom/shared";
import { db } from '@/db/index';
import { students, users } from "@/db/schema";

const factory = createFactory<{ Variables: { teacher: NewStudent } }>();

export const getAllStudents = factory.createHandlers(async (c) => {

    const allStudents = await db.select({
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
    }).from(students);
    return c.json({msg: 'all Students...', allStudents});
});