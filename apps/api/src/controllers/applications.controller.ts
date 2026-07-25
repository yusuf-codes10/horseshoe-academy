import { createFactory } from "hono/factory";
import type { NewApplication } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { insertApplicationSchema } from "@classroom/shared";
import { db } from "@/db/index";
import { applications, classes, students, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { JWTPayloadShape } from "@classroom/shared";

const factory = createFactory<{ Variables: { application: NewApplication } }>();

// apply | create application
export const createApplication = factory.createHandlers(
  zValidator("json", insertApplicationSchema),
  async (c) => {
    // grab class id
    const classId = Number(c.req.param("classId"));

    // TODO: replace with c.get('jwtPayload').id once auth middleware is in place
    const payload = c.get("jwtPayload") as JWTPayloadShape;

    try {
      // verify that class exists
      const [foundClass] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId));

      if (!foundClass)
        throw new HTTPException(404, { message: "class dpes mpt exost!" });

      const [insertedApplication] = await db
        .insert(applications)
        .values({
          studentId: payload.id,
          classId: classId,
        })
        .returning();

      // incremet the classes enrolledStudents? (When approved!)

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

    const foundApplications = await db
      .select()
      .from(applications)
      .where(eq(applications.classId, classId));

    return c.json({ msg: "applications: ", foundApplications });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// get all applications (admin)
export const getAllApplications = factory.createHandlers(async (c) => {
  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 10;
  const skip = (page - 1) * limit;

  const payload = c.get("jwtPayload") as JWTPayloadShape;
  try {
    if (payload.role === "admin") {
      const allApplications = await db
        .select()
        .from(applications)
        .offset(skip)
        .limit(limit)
        .orderBy(applications.id);
      return c.json({ msg: "All applications: ", allApplications });
    } else if (payload.role === "student") {
      const allApplications = await db
        .select({
          id: applications.id,
          status: applications.status,
          username: users.username,
          fullName: users.fullName
        })
        .from(applications)
        .innerJoin(students, eq(students.id, applications.studentId))
        .innerJoin(users, eq(users.id, students.id))
        .offset(skip)
        .limit(limit)
        .orderBy(applications.id);
      return c.json({ msg: "All applications: ", allApplications });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
