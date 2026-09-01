import { createFactory } from "hono/factory";
import type { NewDepartment } from "@classroom/shared";
import { insertDepartmentSchema } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/index";
import { departments, subjects } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { department: NewDepartment } }>();

export const getAllDeps = factory.createHandlers(async (c) => {
  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  // implementing the ?includes param
  // const includes = c.req.query("includes")?.split(",") ?? [];

  // console.log(includes);
  // destructuring that
  // const [subjects_count] = includes;

  // let counts;

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 5;
  const skip = (page - 1) * limit;

  try {
    // if (subjects_count) {
    // }
    // counts = await db
    //   .select({ depId: departments.id, count: count(subjects.id) })
    //   .from(departments)
    //   .leftJoin(subjects, eq(subjects.departmentId, departments.id))
    //   .groupBy(departments.id)
    //   .limit(limit)
    //   .offset(skip)
    //   .orderBy(departments.id);
    const deps = await db
      .select({
        id: departments.id,
        code: departments.code,
        name: departments.name,
        departments: departments.description,
        subjectsCount: count(subjects.id)
      })
      .from(departments)
      .leftJoin(subjects, eq(subjects.departmentId, departments.id))
      .groupBy(departments.id)
      .limit(limit)
      .offset(skip)
      .orderBy(departments.id);

      const depsCount = await db.$count(departments);
    // const filteredDeps = deps.slice(skip, skip + limit);

    return c.json({ msg: "departemetns", deps, depsCount });
  } catch (error) {
    console.log(error);
  }
});

export const getDepById = factory.createHandlers(async (c) => {
  const id = Number(c.req.param("id"));
  try {
    const [dep] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, id));

    if (!dep) throw new HTTPException(404, { message: "dep not found" });

    return c.json({ msg: "found!", dep });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.log(error);
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

export const createNewDepartment = factory.createHandlers(
  zValidator("json", insertDepartmentSchema),
  async (c) => {
    // grab user data
    const body = c.req.valid("json");
    console.log('body', body);

    // check is the depratemnt is already in the databse
    try {
      const [duplicate] = await db
        .select()
        .from(departments)
        .where(eq(departments.code, body.code));

      if (duplicate)
        throw new HTTPException(400, { message: "Department already exists!" });

      // insert a new departement
      const [dep] = await db
        .insert(departments)
        .values({
          name: body.name,
          code: body.code,
        })
        .returning();
      return c.json({ msg: "departement has been created!", dep });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      console.log(error);
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);
