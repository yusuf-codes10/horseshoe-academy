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
export const getSessionPerClass = factory.createHandlers(async (c) => {
  // grab classId
  const classId = Number(c.req.param("classId"));

  try {
    // make sure class exist
    const [foundClass] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    if (!foundClass)
      throw new HTTPException(404, { message: "class does not exit" });

    const foundSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.classId, classId));

    return c.json({ msg: "session: ", foundSessions });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// get a single session by id
export const getSessionById = factory.createHandlers(async (c) => {
  // grab the id
  const sessionId = Number(c.req.param("sessionId"));
  try {
    const [foundSession] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    if (!foundSession)
      throw new HTTPException(404, { message: "Session does not exist!" });

    return c.json({ msg: "session: ", foundSession });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
