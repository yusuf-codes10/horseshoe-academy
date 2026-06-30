import { createFactory } from "hono/factory";
import type { NewSubject } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { insertSubjectSchema } from "@classroom/shared";
import { db } from "../db/index";
import { departments, subjects } from "../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { subject: NewSubject } }>();

export const createSubjectForDepartment = factory.createHandlers(
  zValidator("json", insertSubjectSchema),
  async (c) => {
    // grab the dep is
    const depId = Number(c.req.param("id"));

    // grab credentials from the body
    const body = c.req.valid("json");
    try {
        // make sure the dep exists
        const [dep] = await db
          .select()
          .from(departments)
          .where(eq(departments.id, depId));

        if (!dep)
          throw new HTTPException(404, { message: "departmnet does not exist!" });

        console.log(depId);
        return c.json({ msg: "The dep is...", depId });
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);
