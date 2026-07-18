import { createFactory } from "hono/factory";
import type { NewTeacher } from "@classroom/shared";

const factory = createFactory<{ Variables: { teacher: NewTeacher } }>();

export const getAllTeacher = factory.createHandlers(async (c) => {
  return c.json("teacher router is working");
});
