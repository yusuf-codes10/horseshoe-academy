import { createFactory } from "hono/factory";
import type { NewApplication } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { insertApplicationSchema } from "@classroom/shared";
import { db } from "../db/index";
import { applications, classes } from "../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { application: NewApplication } }>();

// apply | create application
export const createApplication = factory.createHandlers(
  zValidator("json", insertApplicationSchema),
  async (c) => {
    // grab class id
    const classId = Number(c.req.param("classId"));

    // TODO: replace with c.get('jwtPayload').id once auth middleware is in place
    const studentId = 1;

    try {
      // verify that class exists
      const [foundClass] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId));

      if (!foundClass)
        throw new HTTPException(404, { message: "class dpes mpt exost!" });

      const [insertedApplication] = await db.insert(applications).values({
        studentId: studentId,
        classId: classId,
      });

      return c.json({ msg: "application: ", insertedApplication });
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);

// get all applications per class
export const getApplicationsPerClass = factory.createHandlers(async (c) => {
  // grab class id
  const classId = Number(c.req.param("classId"));

  try {
    const [foundClass] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    if (!foundClass)
      throw new HTTPException(404, { message: "class does not exist" });

    const foundApplications = await db.select()
    .from(applications)
    .where(eq(applications.classId, classId));

    return c.json({msg: 'applications: ', foundApplications});
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
