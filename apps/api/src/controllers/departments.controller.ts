import { createFactory } from "hono/factory";
import type { NewDepartment } from "@classroom/shared";
import { insertDepartmentSchema } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/index";
import { departments, subjects } from "@/db/schema";
import { count, eq, ilike, and, or, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { department: NewDepartment } }>();

// ? Shared helper? possibly!
// Escapes LIKE wildcards so "%" and "_" typed by the user are matched literally.
const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export const getAllDeps = factory.createHandlers(async (c) => {
  // Pagination (clamped so ?limit=100000 or ?page=-4 can't cause trouble)
  const page = Math.max(1, Number(c.req.query("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(c.req.query("limit")) || 5));
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

  // One query: rows + filtered total
  const rows = await db
    .select({
      id: departments.id,
      code: departments.code,
      name: departments.name,
      description: departments.description,
      subjectsCount: count(subjects.id),
      // total number of matching departments, before limit/offset
      total: sql<number>`count(*) over()`.mapWith(Number),
    })
    .from(departments)
    .leftJoin(subjects, eq(subjects.departmentId, departments.id))
    .where(whereClause)
    .groupBy(departments.id)
    .orderBy(departments.id)
    .limit(limit)
    .offset(skip);

  // Every row carries the same total
  const depsCount = rows[0]?.total ?? 0;

  // Don't leak the helper column into each row of the response
  const deps = rows.map(({ ...dep }) => dep);

  return c.json({ msg: "departments", deps, depsCount });
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
