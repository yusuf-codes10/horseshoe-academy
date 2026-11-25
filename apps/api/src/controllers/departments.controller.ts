import { createFactory } from "hono/factory";
import type { NewDepartment } from "@classroom/shared";
import { insertDepartmentSchema } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/index";
import { departments, subjects } from "@/db/schema";
import { count, eq, ilike, and } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { department: NewDepartment } }>();

export const getAllDeps = factory.createHandlers(async (c) => {
  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 5;
  const skip = (page - 1) * limit;

  const searchQuery = c.req.query("search");

  // conditions array to support multiple conditions
  const conditions = [];

  if (searchQuery !== undefined)
    conditions.push(ilike(departments.name, `%${searchQuery}%`));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const deps = await db
    .select({
      id: departments.id,
      code: departments.code,
      name: departments.name,
      description: departments.description,
      subjectsCount: count(subjects.id),
    })
    .from(departments)
    .leftJoin(subjects, eq(subjects.departmentId, departments.id))
    .groupBy(departments.id)
    .where(whereClause)
    .limit(limit)
    .offset(skip)
    .orderBy(departments.id);

  const depsCount = await db.$count(departments);
  // const filteredDeps = deps.slice(skip, skip + limit);

  return c.json({ msg: "departemetns", deps, depsCount });
});

export const getDepById = factory.createHandlers(async (c) => {
  const id = Number(c.req.param("id"));
  const [dep] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id));

  if (!dep) throw new HTTPException(404, { message: "dep not found" });

  return c.json({ msg: "found!", dep });
});

export const createNewDepartment = factory.createHandlers(
  zValidator("json", insertDepartmentSchema),
  async (c) => {
    // grab user data
    const body = c.req.valid("json");
    console.log("body", body);

    // check is the depratemnt is already in the databse
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
  },
);
