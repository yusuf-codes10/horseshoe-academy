import { createFactory } from "hono/factory";
import type { NewEnrollement } from "@classroom/shared";
import { insertEnrollementSchema } from "@classroom/shared";
import { db } from "@/db/index";
import { eq, sql } from "drizzle-orm";
import { applications, enrollements, classes, students, users } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { enrollement: NewEnrollement } }>();

// a transcation PATCH query
export const acceptApplications = factory.createHandlers(
  zValidator("json", insertEnrollementSchema),
  async (c) => {
    const applicationsId = c.req.param("applicationId");
    const body = c.req.valid("json");

    try {
      await db.transaction(async (tx) => {
        // 1. update application status to accepted
        await tx
          .update(applications)
          .set({ status: "accepted" })
          .where(eq(applications.id, Number(applicationsId)));

        // 2. create enrollment record
        await tx.insert(enrollements).values({
          studentId: body.studentId,
          classId: body.classId,
        });

        // 3. increment enrolledCount on the class
        await tx
          .update(classes)
          .set({ enrolledCount: sql`${classes.enrolledCount} + 1` })
          .where(eq(classes.id, Number(body.classId)));
      });
      return c.json({ msg: "application accepted!" });
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);

// a transaction PATCH request for rejection
export const rejectApplication = factory.createHandlers(
  // zValidator("json", insertEnrollementSchema),
  async (c) => {
    const applicationsId = c.req.param("applicationId");
    // const body = c.req.valid("json");

    try {
      // we need a transaction: only when we do notifications
      // await db.transaction(async (tx) => {

      // })
      // check if applications exists!
      const [foundApplication] = await db
        .select()
        .from(applications)
        .where(eq(applications.id, Number(applicationsId)));

      if (!foundApplication)
        throw new HTTPException(404, {
          message: "Application does not exist!",
        });
      await db
        .update(applications)
        .set({ status: "rejected" })
        .where(eq(applications.id, Number(applicationsId)));
      return c.json({ msg: "application rejected" });
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);

// get enrolled student per class
export const getEnrolledStudentsPerClass = factory.createHandlers(async (c) => {

  const classId = c.req.param('classId');
  try {

    await db.select()
    .from(enrollements)
    .innerJoin(students, eq(students.id, enrollements.studentId))
    .innerJoin(users, eq(users.id, students.id))
    .where(eq(enrollements.classId, Number(classId)));
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
  return c.json({ msg: "" });
});
