import { createFactory } from "hono/factory";
import type { NewStudent } from "@classroom/shared";

const factory = createFactory<{ Variables: { teacher: NewStudent } }>();

export const getAllStudents = factory.createHandlers(async (c) => {
    return c.json({msg: 'something'});
});