import { createFactory } from "hono/factory";
import type { NewClass, JWTPayloadShape } from "@classroom/shared";
import { insertClassSchema } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/index";
import { classes, subjects, teachers, users, applications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { class: NewClass } }>();

// create a class
export const createClass = factory.createHandlers(
  zValidator("json", insertClassSchema),
  async (c) => {
    // const subjectId = Number(c.req.param("subjectId"));
    const body = c.req.valid("json");

    const { subjectId, capacity, code, description } = body;
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
  },
);

// get classes per subject
export const getClassesBySubjectId = factory.createHandlers(async (c) => {
  const subjectId = Number(c.req.param("subjectId"));
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
});

// get a single class by id
export const getClassById = factory.createHandlers(async (c) => {
  const classId = Number(c.req.param("classId"));

  const payload = c.get("jwtPayload") as JWTPayloadShape;
  // adding the subject name here as an inner join
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
});

export const getAllClasses = factory.createHandlers(async (c) => {
  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  // casting them
  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 5;
  const skip = (page - 1) * limit;

  const payload = c.get("jwtPayload") as JWTPayloadShape;
    if (payload.role === "student") {
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
        .innerJoin(subjects, eq(subjects.id, classes.subjectId))
        .innerJoin(teachers, eq(teachers.id, classes.teacherId))
        .innerJoin(users, eq(users.id, teachers.id))
        .limit(limit)
        .offset(skip)
        .orderBy(classes.id);

      const classesCount = await db.$count(classes);

      return c.json({ msg: "classes: ", fetchedClasses, classesCount });
    } else {
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
    }
});

// get my classes (teacher)
export const getMyClasses = factory.createHandlers(async (c) => {
  const payload = c.get("jwtPayload") as JWTPayloadShape;
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
});
