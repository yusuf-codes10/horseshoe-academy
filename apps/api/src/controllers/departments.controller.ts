import { createFactory } from "hono/factory";
import type { NewDepartment } from "@classroom/shared";
import { insertDepartmentSchema } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index";
import { departments } from "../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{ Variables: { department: NewDepartment } }>();

export const getAllDeps = factory.createHandlers(async (c) => {
  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

    const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 5;
  const skip = (page - 1) * limit;
  try {
    const deps = await db.select().from(departments);

    return c.json({ msg: "departemetns", deps });
  } catch (error) {
    console.log(error);
  }
});

export const createNewDepartment = factory.createHandlers(
  zValidator("json", insertDepartmentSchema),
  async (c) => {
    // grab user data
    const body = c.req.valid("json");

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
