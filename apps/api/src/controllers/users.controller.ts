import { createFactory } from "hono/factory";
import type { NewUser, NewStudent, NewTeacher } from '@classroom/shared';
import { db } from '@/db/index';
import { users, teachers, students } from '@/db/schema';
import { eq } from 'drizzle-orm';

const factory = createFactory<{Variables: {user: NewUser & NewStudent | NewUser & NewTeacher}}>();

// get my profile controller
export const getMyProfile = factory.createHandlers(
    async (c) => {
        // grab the user id only from the auth middleware
        const payload = c.get('jwtPayload') as JWTPayloadShape;

        try {
            const [foundUser] = await db.select()
            .from(users)
            .where(eq(users.id, payload.id));
            return c.json('my profile');
        } catch (error) {
            console.log(error);
        }
    }
);