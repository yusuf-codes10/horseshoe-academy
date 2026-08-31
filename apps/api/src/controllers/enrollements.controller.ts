import { createFactory } from "hono/factory";
import type { NewEnrollement, NewNotification, JWTPayloadShape } from "@classroom/shared";
import { insertEnrollementSchema } from "@classroom/shared";
import { db } from "@/db/index";
import { eq, sql } from "drizzle-orm";
import {
  applications,
  enrollements,
  classes,
  students,
  users,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { pushNotification } from "@/services/pushNotifications";
// import type { JWTPayloadShape } from "@classroom/shared";

const factory = createFactory<{ Variables: { enrollement: NewEnrollement } }>();

// a transcation PATCH query
export const acceptApplications = factory.createHandlers(
  zValidator("json", insertEnrollementSchema),
  async (c) => {
    // const payload = c.get('jwtPayload') as JWTPayloadShape;
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

        // 4. notify the user
        // typing a notifciation here
        const notification: NewNotification = {
          title: "Application Accepted",
          content: "Your application to...",
          action: `applications/${applicationsId}`,
          userId: body.studentId,
          isRead: false,
        };
        await pushNotification(notification, tx);
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
  zValidator("json", insertEnrollementSchema),
  async (c) => {
    const applicationsId = c.req.param("applicationId");
    const body = c.req.valid("json");

    try {
      // check if applications exists!
      const [foundApplication] = await db
        .select()
        .from(applications)
        .where(eq(applications.id, Number(applicationsId)));

      if (!foundApplication)
        throw new HTTPException(404, {
          message: "Application does not exist!",
        });
      // we need a transaction: only when we do notifications
      await db.transaction(async (tx) => {
        // 1. updating the applications
        await tx
          .update(applications)
          .set({ status: "rejected" })
          .where(eq(applications.id, Number(applicationsId)));

        // 2. notify the user
        const notification: NewNotification = {
          title: "Application Rejected",
          content: "Your application to...",
          action: `applications/${applicationsId}`,
          userId: body.studentId,
          isRead: false,
        };
        await pushNotification(notification, tx);

      });
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
  const classId = c.req.param("classId");

  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 10;
  const skip = (page - 1) * limit;

  try {
    const enrolledStudents = await db
      .select({
        id: enrollements.id,
        studentId: enrollements.studentId,
        classId: enrollements.classId,

        // student
        gpa: students.gpa,

        // users
        fullName: users.fullName,
        username: users.username,
        gender: users.gender,
      })
      .from(enrollements)
      .innerJoin(students, eq(students.id, enrollements.studentId))
      .innerJoin(users, eq(users.id, students.id))
      .where(eq(enrollements.classId, Number(classId)))
      .offset(skip)
      .limit(limit)
      .orderBy(enrollements.id);
    return c.json({ msg: "enrolled students: ", enrolledStudents });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// get my enrollements per student
// ! NOTE: Do not collapse into one GET controller and let the role decide
export const getMyEnrollements = factory.createHandlers(async (c) => {
  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 10;
  const skip = (page - 1) * limit;

  const payload = c.get("jwtPayload") as JWTPayloadShape;

  try {
    const enrolls = await db.select()
    .from(enrollements)
    .where(eq(enrollements.studentId, Number(payload.id)))
    .offset(skip)
    .limit(limit)
    return c.json({msg: 'Your Enrollements', enrolls});
  } catch (error) {
       console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" }); 
  }
})