import { createFactory } from "hono/factory";
import type { NewEnrollement } from "@classroom/shared";
import { insertEnrollementSchema } from "@classroom/shared";
import { db } from "@/db/index";
import { eq, sql } from "drizzle-orm";
import { applications, enrollements, classes } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";

const factory = createFactory<{ Variables: { enrollement: NewEnrollement } }>();

// a transcation POST query
export const acceptApplications = factory.createHandlers(
  zValidator("json", insertEnrollementSchema),
  (c) => {
    const applicationsId = Number(c.req.param("applicationId"));
    const body = c.req.valid("json");

    db.transaction(async (tx) => {
      // 1. update application status to accepted
      await tx
        .update(applications)
        .set({ status: "accepted" })
        .where(eq(applications.id, applicationsId));
      // 2. create enrollment record
      await tx.insert(enrollements).values({
        studentId: body.studentId,
        classId: body.classId,
      });

      // 3. increment enrolledCount on the class
      await tx.update(classes)
      .set({enrolledCount: sql`${classes.enrolledCount} + 1` })
      .where(eq(classes.id, Number(body.classId)));
    });
    return c.json({ msg: "accept applications" });
  },
);
