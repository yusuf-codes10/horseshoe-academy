import { streamSSE } from "hono/streaming";
import { createFactory } from "hono/factory";

const factory = createFactory();

export const sendNotification = factory.createHandlers(
    (c) => {
        return streamSSE(c, async (stream) => {
            console.log(stream);
        });
    }
);