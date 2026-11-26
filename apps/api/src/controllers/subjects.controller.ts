import { createFactory } from "hono/factory";
import type { NewSubject } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { insertSubjectSchemaWithDepCode } from "@classroom/shared";
import { db } from "@/db/index";
import { departments, subjects } from "@/db/schema";
import { eq, and, ilike, or } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { subject: NewSubject } }>();

export const createSubjectForDepartment = factory.createHandlers(
  zValidator("json", insertSubjectSchemaWithDepCode),
  async (c) => {
    // grab the dep is
    // const depId = Number(c.req.param("id"));

    // grab credentials from the body
    const body = c.req.valid("json");
    // we should find department by the code
    // make sure the dep exists
    const [dep] = await db
      .select()
      .from(departments)
      .where(eq(departments.code, body.departmentCode));

    if (!dep)
      throw new HTTPException(404, { message: "departmnet does not exist!" });

    const [subject] = await db
      .insert(subjects)
      .values({
        name: body.name,
        description: body.description,
        departmentId: dep.id,
      })
      .returning();
    return c.json(subject);
  },
);

// get subject by departements
export const getSubjectByDepId = factory.createHandlers(async (c) => {
  //grab dep id
  const depId = Number(c.req.param("id"));

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
});

// delete a subject
export const deleteSujectById = factory.createHandlers(async (c) => {
  const subjectId = Number(c.req.param("subjectId"));

  const [foundSubject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, subjectId));

  if (!foundSubject)
    throw new HTTPException(404, { message: "subject does not exist!" });

  // it exists now!
  await db.delete(subjects).where(eq(subjects.id, subjectId));

  return c.json({ msg: "subject deleted successfuly!" });
});

export const getSubjectById = factory.createHandlers(async (c) => {
  const subjectId = Number(c.req.param("subjectId"));

  const [foundSubject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, subjectId));

  if (!foundSubject)
    throw new HTTPException(404, { message: "Subject not found!" });

  return c.json({ msg: "subject: ", foundSubject });
});

const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

// get all subjects
export const getAllSubjects = factory.createHandlers(async (c) => {
  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 2;
  const skip = (page - 1) * limit;

  // Search: trim it, ignore empty strings, cap the length
  const search = (c.req.query("search") ?? "").trim().slice(0, 50);

  const conditions = [];

    if (search) {
      const pattern = `%${escapeLike(search)}%`;
      // Match name OR code, so "CS" finds Computer Science
      conditions.push(or(ilike(departments.name, pattern), ilike(departments.code, pattern)));
    }
  
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const subs = await db
    .select({
      id: subjects.id,
      name: subjects.name,
      description: subjects.description,
      departmentCode: departments.code,
    })
    .from(subjects)
    .innerJoin(departments, eq(departments.id, subjects.departmentId))
    .groupBy(subjects.id, departments.id)
    .limit(limit)
    .offset(skip)
    .orderBy(subjects.id);

  // await db.select({
  //   code: departments.code
  // })
  // .from(departments)
  // .where(eq(departments.id, subjects.departmentId));

  const subjectsCount = await db.$count(subjects);
  return c.json({ msg: "subjects", subs, subjectsCount });
});
