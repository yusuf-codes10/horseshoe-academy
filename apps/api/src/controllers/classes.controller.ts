import { createFactory } from "hono/factory";
import type { NewClass } from "@classroom/shared";
import { insertClassSchema } from "@classroom/shared";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index";
import { classes, subjects } from "../db/schema";
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
      const insertedClass = await db.insert(classes).values({
        capacity: body.capacity,
        // TODO: we might assign a teacher to a class right here
        subjectId: subjectId,
      }).returning();

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
    zValidator('json', insertClassSchema.pick({
        teacherId: true
    })),
    (c) => {
        
    }
);