import { createFactory } from "hono/factory";
import type { NewNotification } from '@classroom/shared';
import { notifications } from "@/db/schema";
import { db } from '@/db/index';
import type { JWTPayloadShape } from "@classroom/shared";
import { eq } from 'drizzle-orm';

const factory = createFactory<{Variables: {notification: NewNotification}}>();

// get My notifications: GET
export const getMyNotifications = factory.createHandlers(
    async (c) => {
        const payload = c.get('jwtPayload') as JWTPayloadShape;
        try {
            const allNotifications = await db.select()
            .from(notifications)
            .where(eq(notifications.userId, payload.id));

            return c.json({msg: 'notifications', allNotifications});
        } catch (error) {
            console.log(error);
        }
    }
);

// patch, read
export const readMyNotification = factory.createHandlers(
    (c) => {
        return c.json({msg: 'notification has been read!'});
    }
);

export const deleteMyNotification = factory.createHandlers(
    (c) => {
        return c.json({msg: 'notification has been deleted!'});
    }
);
