import { createFactory } from "hono/factory";
import type { NewSession } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { insertSessionSchema } from "@classroom/shared";
import { db } from "../db/index";
import { classes, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { session: NewSession } }>();

export const createSession = factory.createHandlers(
  zValidator("json", insertSessionSchema),
  async (c) => {
    // grab the class id
    const classId = Number(c.req.param("classId"));
    const body = c.req.valid("json");

    try {
      const [foundClass] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId));

      if (!foundClass)
        throw new HTTPException(404, { message: "class does not exist!" });

      // now create the session
      const [insertedSession] = await db
        .insert(sessions)
        .values({
          date: body.date,
          location: body.location,
          classId: classId,
        })
        .returning();
      return c.json({ msg: "new session: ", insertedSession });
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);

// get all sessions per class

// get a single session by id

// get all session | dev testing
export const getAllSessions = factory.createHandlers(
    (c) => {
        try {
            
        } catch (error) {
            
        }
    }
);