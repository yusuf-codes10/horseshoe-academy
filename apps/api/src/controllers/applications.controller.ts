import { createFactory } from "hono/factory";
import type { NewApplication, NewNotification } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { insertApplicationSchema } from "@classroom/shared";
import { db } from "@/db/index";
import { applications, classes, students, users, teachers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { HTTPException } from "hono/http-exception";
import type { JWTPayloadShape } from "@classroom/shared";
import { pushNotification } from "@/services/pushNotifications";

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

      // TODO: we need a transaction here, to notifiy the teacher that someone applied to his class
      await db.transaction(async (tx) => {
        const [insertedApplication] = await db
          .insert(applications)
          .values({
            studentId: payload.id,
            classId: classId,
          })
          .returning();

        // make sure the insertedApplication is there
        if (!insertedApplication)
          throw new HTTPException(500, { message: "Somthing went wrong" });

        // grab the tacher of that class
        const [foundTeacher] = await db.select({
          id: teachers.id
        })
        .from(teachers)
        .innerJoin(classes, eq(classes.teacherId, teachers.id))
        .where(eq(classes.id, classId));

        if (!foundTeacher) throw new HTTPException(404, {message: 'Not found!'});

        // 2. notify the teacher of this class
        const notification: NewNotification = {
          title: "Application Rejected",
          content: "Your application to...",
          action: `applications/${insertedApplication.id}`,
          userId: foundTeacher.id,
          isRead: false,
        };
        await pushNotification(notification, tx);
        return c.json({ msg: "application: ", insertedApplication });
      });

      // incremet the classes enrolledStudents? (When approved!)
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
        .select({
          id: applications.id,
          status: applications.status,
          username: users.username,
          studentName: users.fullName,
          classId: applications.classId,
          studentId: students.id,
        })
        .from(applications)
        .innerJoin(students, eq(students.id, applications.studentId))
        .innerJoin(users, eq(users.id, students.id))
        .offset(skip)
        .limit(limit)
        .orderBy(applications.id);

      const appsCount = await db.$count(applications);

      return c.json({ msg: "All applications: ", allApplications, appsCount });
    } else if (payload.role === "student") {
      const allApplications = await db
        .select({
          id: applications.id,
          status: applications.status,
          username: users.username,
          studentName: users.fullName,
          classId: applications.classId,
          studentId: students.id,
        })
        .from(applications)
        .innerJoin(students, eq(students.id, applications.studentId))
        .innerJoin(users, eq(users.id, students.id))
        .where(eq(applications.studentId, payload.id))
        .offset(skip)
        .limit(limit)
        .orderBy(applications.id);

      // we need to count this manually
      const appsCount = await db.$count(
        applications,
        eq(applications.studentId, payload.id),
      );
      return c.json({ msg: "All applications: ", allApplications, appsCount });
    } else if (payload.role === "teacher") {
      // some aliases
      const studentUsers = alias(users, "student_users");
      const teacherUsers = alias(users, "teacher_users");

      const allApplications = await db
        .select({
          id: applications.id,
          status: applications.status,
          username: teacherUsers.username,
          classId: applications.classId,
          studentId: studentUsers.id,
          studentName: studentUsers.fullName,
        })
        .from(applications)
        .innerJoin(classes, eq(classes.id, applications.classId))
        .innerJoin(teachers, eq(teachers.id, classes.teacherId))
        .innerJoin(teacherUsers, eq(teacherUsers.id, teachers.id))
        .innerJoin(students, eq(students.id, applications.studentId))
        .innerJoin(studentUsers, eq(studentUsers.id, students.id))
        .where(eq(teachers.id, payload.id))
        .offset(skip)
        .limit(limit)
        .orderBy(applications.id);
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(applications)
        .innerJoin(classes, eq(classes.id, applications.classId))
        .innerJoin(teachers, eq(teachers.id, classes.teacherId))
        .where(eq(teachers.id, payload.id));
      return c.json({
        msg: "All applications: ",
        allApplications,
        appsCount: Number(result?.count ?? 0),
      });
    } else {
      throw new HTTPException(403, { message: "forbidden" });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// get Application By id
export const getApplicationById = factory.createHandlers(async (c) => {
  const applicationId = Number(c.req.param("applicationId"));
  try {
    const [foundApplication] = await db
      .select({
        id: applications.id,
        status: applications.status,
        studentName: users.fullName,
        studentId: users.id,
        classCode: classes.code,
        capacity: classes.capacity,
        enrolledCount: classes.enrolledCount,
        classId: classes.id,
      })
      .from(applications)
      .innerJoin(students, eq(students.id, applications.studentId))
      .innerJoin(users, eq(users.id, students.id))
      .innerJoin(classes, eq(classes.id, applications.classId))
      .where(eq(applications.id, applicationId));

    if (!foundApplication)
      throw new HTTPException(404, { message: "application does not exist!" });
    return c.json({ msg: "foundApplication: ", foundApplication });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
