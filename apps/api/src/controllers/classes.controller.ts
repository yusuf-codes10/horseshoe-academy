import { createFactory } from "hono/factory";
import type { NewClass } from "@classroom/shared";
import { insertClassSchema } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/index";
import { classes, subjects, teachers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { class: NewClass } }>();

// create a class
export const createClass = factory.createHandlers(
  zValidator("json", insertClassSchema),
  async (c) => {
    const subjectId = Number(c.req.param("subjectId"));
    const body = c.req.valid("json");

    try {
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
          capacity: body.capacity,
          // TODO: we might assign a teacher to a class right here
          // or a patch request instead (admin assigns)
          subjectId: subjectId,
        })
        .returning();

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

      const [updatedClass] = await db
        .update(classes)
        .set({ teacherId: body.teacherId })
        .where(eq(classes.id, classId));

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

  try {
    const [foundClass] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    if (!foundClass)
      throw new HTTPException(404, { message: "class does not exist!" });

    return c.json({ msg: "class: ", foundClass });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
