import { createFactory } from "hono/factory";
import type { NewSubject } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { insertSubjectSchema } from "@classroom/shared";
import { db } from "@/db/index";
import { departments, subjects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { subject: NewSubject } }>();

export const createSubjectForDepartment = factory.createHandlers(
  zValidator("json", insertSubjectSchema),
  async (c) => {
    // grab the dep is
    const depId = Number(c.req.param("id"));

    // grab credentials from the body
    const body = c.req.valid("json");
    try {
      // make sure the dep exists
      const [dep] = await db
        .select()
        .from(departments)
        .where(eq(departments.id, depId));

      if (!dep)
        throw new HTTPException(404, { message: "departmnet does not exist!" });

      const [subject] = await db
        .insert(subjects)
        .values({
          name: body.name,
          description: body.description,
          departmentId: depId,
        })
        .returning();
      return c.json(subject);
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);

// get subject by departements
export const getSubjectByDepId = factory.createHandlers(async (c) => {
  //grab dep id
  const depId = Number(c.req.param("id"));

  try {
    const [foundDep] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, depId));

    if (!foundDep)
      throw new HTTPException(404, { message: "deprtements does not exist!" });

    // getting all  subjects related to foundDep
    const foundSubjects = await db
      .select()
      .from(subjects)
      .where(eq(subjects.departmentId, depId));

    return c.json(foundSubjects);
  } catch (error) {
    console.log(error);
  }
});

// delete a subject
export const deleteSujectById = factory.createHandlers(async (c) => {
  const subjectId = Number(c.req.param("subjectId"));

  try {
    const [foundSubject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, subjectId));

    if (!foundSubject)
      throw new HTTPException(404, { message: "subject does not exist!" });

    // it exists now!
    await db.delete(subjects).where(eq(subjects.id, subjectId));

    return c.json({ msg: "subject deleted successfuly!" });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

export const getSubjectById = factory.createHandlers(
  async (c) => {
    const subjectId = Number(c.req.param('subjectId'));

    try {
      const [foundSubject] = await db.select()
      .from(subjects)
      .where(eq(subjects.id, subjectId));

      if (!foundSubject) throw new HTTPException(404, {message: 'Subject not found!'});

      return c.json({msg: 'subject: ', foundSubject});
    } catch (error) {
          console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
    }
  }
);

// get all subjects
export const getAllSubjects = factory.createHandlers(
  async (c) => {
    const pageQuery = c.req.query('page');
    const limitQuery = c.req.query('limit');

    const page = Number(pageQuery) || 1;
    const limit = Number(limitQuery) || 2;
    const skip = (page - 1) * limit;
    try {
      const subs = await db.select()
      .from(subjects)
      .groupBy(subjects.id)
      .limit(limit)
      .offset(skip)
      .orderBy(subjects.id);

      const subjectsCount = await db.$count(subjects)
      return c.json({msg: 'subjects', subs, subjectsCount});
    } catch (error) {
      console.log(error);
    }
  }
);
