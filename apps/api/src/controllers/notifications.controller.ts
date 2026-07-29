import { createFactory } from "hono/factory";
import type { NewNotification } from '@classroom/shared';

const factory = createFactory<{Variables: {notification: NewNotification}}>();

export const createNotification = factory.createHandlers(
    (c) => {
        return c.json({msg: 'notifications'})
    }
);
