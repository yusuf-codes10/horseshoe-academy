import { createFactory } from "hono/factory";
import type { NewTeacher } from "@classroom/shared";
import { teachers, users } from '@/db/schema';
import { db } from '@/db/index';
import { eq } from 'drizzle-orm';

const factory = createFactory<{ Variables: { teacher: NewTeacher } }>();

export const getAllTeacher = factory.createHandlers(async (c) => {
    try {
        const allTeachers = await db.select({
            id: teachers.id,
            username: users.username,
            email: users.email,
            gender: users.gender,
            fullName: users.fullName,
            role: users.role,
            createdAt: users.createdAt,
            degree: teachers.degree,
            major: teachers.major,
            salary: teachers.salary
        })
        .from(teachers)
        .innerJoin(users, eq(users.id, teachers.id));
        return c.json({msg: 'teachers: ', allTeachers});
    } catch (error) {
        console.log(error);
    }
});
