import { createFactory } from "hono/factory";
import type { NewUser, NewStudent, NewTeacher } from '@classroom/shared';
import { db } from '@/db/index';
import { users, teachers, students } from '@/db/schema';

const factory = createFactory<{Variables: {user: NewUser & NewStudent | NewUser & NewTeacher}}>();

// get my profile controller
export const getMyProfile = factory.createHandlers(
    async (c) => {
        return c.json('my profile');
    }
);