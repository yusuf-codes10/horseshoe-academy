import { createFactory } from "hono/factory";
import type { NewSession, JWTPayloadShape } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { insertSessionSchema } from "@classroom/shared";
import { db } from "@/db/index";
import { classes, sessions, teachers } from "@/db/schema";
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
          name: body.name,
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

// delete session
export const deleteSession = factory.createHandlers(async (c) => {
  // grab the session id
  const sessionId = Number(c.req.param("sessionId"));

  try {
    // make sure the session exist
    const result = await db.delete(sessions).where(eq(sessions.id, sessionId));

    if (result.length === 0)
      throw new HTTPException(404, { message: "session does not exist" });

    return c.json({ msg: "record has been deleted!" });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// get all sessions (admin only)
export const getAllSessions = factory.createHandlers(async (c) => {
  const pageQuery = c.req.param("page");
  const limitQuery = c.req.param("limit");

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 5;
  const skip = (page - 1) * limit;
  try {
    const allSessions = await db
      .select()
      .from(sessions)
      .groupBy(sessions.id)
      .offset(skip)
      .limit(limit)
      .orderBy(sessions.id);

      // return the count too
      const sessionsCount = await db.$count(sessions);
    return c.json({ msg: "All Sessions:", allSessions, sessionsCount });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// get my seesions
export const getMySessions = factory.createHandlers(async (c) => {
  const payload = c.get("jwtPayload") as JWTPayloadShape;
  try {
    // check if teacher exists
    const [foundTeacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, Number(payload.id)));

    if (!foundTeacher)
      throw new HTTPException(404, { message: "Teacher not found!" });

    // find the teacher's classes by joining both sessions and classes
    const mySessions = await db.select(
      {
        id: sessions.id,
        name: sessions.name,
        location: sessions.location,
        date: sessions.date,
        status: sessions.status,
        classId: sessions.classId,
      }
    )
    .from(sessions)
    .innerJoin(classes, eq(classes.id, sessions.classId))
    .where(eq(classes.teacherId, foundTeacher.id));
    return c.json({msg: 'My sessions: ', mySessions});
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
// TODO: next clean the usage of the ! operator when needed
