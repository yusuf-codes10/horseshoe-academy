import { streamSSE } from "hono/streaming";
import { createFactory } from "hono/factory";
import { activeConnections } from '@/events/index';
import type { JWTPayloadShape } from "@classroom/shared";

const factory = createFactory();

export const sendNotification = factory.createHandlers(
    (c) => {
        const payload = c.get('jwtPayload') as JWTPayloadShape;
        return streamSSE(c, async (stream) => {

            // setting the connection
            activeConnections.set(payload.id, stream);
            console.log(stream);
        });
    }
);