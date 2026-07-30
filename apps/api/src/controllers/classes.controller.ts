import { createFactory } from "hono/factory";
import type { NewClass, NewNotification } from "@classroom/shared";
import { insertClassSchema } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/index";
import { classes, subjects, teachers, users, applications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { JWTPayloadShape } from "@classroom/shared";
import { pushNotification } from "@/services/pushNotifications";

const factory = createFactory<{ Variables: { class: NewClass } }>();

// create a class
export const createClass = factory.createHandlers(
  zValidator("json", insertClassSchema),
  async (c) => {
    // const subjectId = Number(c.req.param("subjectId"));
    const body = c.req.valid("json");

    const { subjectId, capacity, code, description } = body;

    try {
      // type narrowing for the subjectId
      if (!subjectId)
        throw new HTTPException(400, { message: "Subject ID is required" });

      // check if that subject exist
      const [foundSubject] = await db
        .select()
        .from(subjects)
        .where(eq(subjects.id, subjectId));

      if (!foundSubject)
        throw new HTTPException(404, { message: "Subject does not exist" });

      // insert a new class
      const insertedClass = await db
        .insert(classes)
        .values({
          capacity: capacity,
          code: code,
          description: description,
          // TODO: we might assign a teacher to a class right here
          // or a patch request instead (admin assigns)
          subjectId: subjectId,
        })
        .returning();

      console.log("the new class", insertedClass);
      return c.json({ msg: "class has been created", insertedClass });
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);

// asign a teacher to a class
export const assignTacherToClass = factory.createHandlers(
  zValidator(
    "json",
    insertClassSchema.pick({
      teacherId: true,
    }),
  ),
  async (c) => {
    // grab the class id
    const classId = Number(c.req.param("classId"));
    const body = c.req.valid("json");

    try {
      // check if class exists
      const [foundClass] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId));

      if (!foundClass)
        throw new HTTPException(404, { message: "class not found!" });

      // check if the teacher exists too
      const [foundTeacher] = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, Number(body.teacherId)));

      if (!foundTeacher)
        throw new HTTPException(404, { message: "Teacher does not exist!" });

      // TODO: we need another notification here for assigning a teacher
      let updatedClass;
      await db.transaction(async (tx) => {
        // 1. assign the teacher
        [updatedClass] = await tx
          .update(classes)
          .set({ teacherId: body.teacherId })
          .where(eq(classes.id, classId));
        // 2. notify the teacher
        // 2. notify the user
        const notification: NewNotification = {
          title: "Assigned to A Class",
          content: "Congratulations! You have been Asigned to...",
          action: `classes/${classes.id}`,
          userId: body.teacherId,
          isRead: false,
        };
        await pushNotification(notification, tx);
      });

      return c.json({ msg: "teacher assigned", updatedClass });
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);

// get classes per subject
export const getClassesBySubjectId = factory.createHandlers(async (c) => {
  const subjectId = Number(c.req.param("subjectId"));

  try {
    const [foundSubject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, subjectId));

    if (!foundSubject)
      throw new HTTPException(404, { message: "subject does not exist!" });

    const foundClasses = await db
      .select()
      .from(classes)
      .where(eq(classes.subjectId, subjectId));

    return c.json({ msg: "classes...", foundClasses });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// get a single class by id
export const getClassById = factory.createHandlers(async (c) => {
  const classId = Number(c.req.param("classId"));

  const payload = c.get("jwtPayload") as JWTPayloadShape;
  // adding the subject name here as an inner join
  try {
    // TODO: we should migrate and add current student in this class
    const [foundClass] = await db
      .select({
        id: classes.id,
        code: classes.code,
        capacity: classes.capacity,
        enrolledCount: classes.enrolledCount,
        description: classes.description,
        subjectId: classes.subjectId,
        teacherId: classes.teacherId,
        subjectName: subjects.name,
      })
      .from(classes)
      .innerJoin(subjects, eq(subjects.id, classes.subjectId))
      .where(eq(classes.id, classId));

    if (!foundClass)
      throw new HTTPException(404, { message: "class does not exist!" });

    if (payload.role === "student") {
      // find the application
      const [isApplied] = await db
        .select()
        .from(applications)
        .where(
          and(
            eq(applications.classId, classId),
            eq(applications.studentId, payload.id),
          ),
        );
      return c.json({ msg: "class: ", foundClass, isApplied });
    }
    return c.json({ msg: "class: ", foundClass });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

export const getAllClasses = factory.createHandlers(
  // TODO: 1- implement pagination
  // TODO: 2- joins to return the subject and department names
  async (c) => {
    const pageQuery = c.req.query("page");
    const limitQuery = c.req.query("limit");

    // casting them
    const page = Number(pageQuery) || 1;
    const limit = Number(limitQuery) || 5;
    const skip = (page - 1) * limit;
    try {
      const fetchedClasses = await db
        .select({
          id: classes.id,
          capacity: classes.capacity,
          enrolledCount: classes.enrolledCount,
          subjectId: classes.subjectId,
          teacherId: classes.teacherId,
          teacherName: users.fullName,
          subjectName: subjects.name,
        })
        .from(classes)
        .leftJoin(subjects, eq(subjects.id, classes.subjectId))
        .leftJoin(teachers, eq(teachers.id, classes.teacherId))
        .leftJoin(users, eq(users.id, teachers.id))
        // .groupBy(classes.id, subjects.name)
        .limit(limit)
        .offset(skip)
        .orderBy(classes.id);

      // 1- return the subject name it belongs to
      // const [subject] = await db.select()
      // .from(subjects)
      // .where(eq(subjects.id, ))

      const classesCount = await db.$count(classes);

      return c.json({ msg: "classes: ", fetchedClasses, classesCount });
    } catch (error) {
      console.log(error);
    }
  },
);

// get my classes (teacher)
export const getMyClasses = factory.createHandlers(async (c) => {
  const payload = c.get("jwtPayload") as JWTPayloadShape;
  try {
    // check if teacher exists
    const [foundTeacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, payload.id));

    if (!foundTeacher)
      throw new HTTPException(404, { message: "teacher does not exist!" });

    const myClasses = await db
      .select({
        id: classes.id,
        capacity: classes.capacity,
        subjectName: subjects.name,
        subjectId: subjects.id,
        teacherId: classes.teacherId,
        teacherName: users.fullName,
      })
      .from(classes)
      .innerJoin(subjects, eq(subjects.id, classes.subjectId))
      .innerJoin(teachers, eq(teachers.id, classes.teacherId))
      .innerJoin(users, eq(users.id, teachers.id))
      .where(eq(classes.teacherId, foundTeacher.id));
    return c.json({ msg: "My Classes:", myClasses });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.log(error);
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
