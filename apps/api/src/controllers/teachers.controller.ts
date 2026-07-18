import { createFactory } from "hono/factory";
import type { NewTeacher } from "@classroom/shared";
import { db } from '@/db/index';
import { teachers } from '@/db/schema';

const factory = createFactory<{ Variables: { teacher: NewTeacher } }>();

export const getAllTeacher = factory.createHandlers(async (c) => {

    try {
        const allTeachers = await db.select()
        .from(teachers);
        return c.json({msg: 'teachers: ', allTeachers});
    } catch (error) {
        console.log(error);
    }
});
