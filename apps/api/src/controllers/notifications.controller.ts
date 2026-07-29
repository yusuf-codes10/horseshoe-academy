import { createFactory } from "hono/factory";
import type { NewNotification } from '@classroom/shared';

const factory = createFactory<{Variables: {notification: NewNotification}}>();

// get My notifications: GET
export const getMyNotifications = factory.createHandlers(
    (c) => {
        return c.json({msg: 'notifications'});
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
