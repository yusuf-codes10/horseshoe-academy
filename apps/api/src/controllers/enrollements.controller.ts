import { createFactory } from "hono/factory";
import type { NewEnrollement } from "@classroom/shared";
import { db } from "@/db/index";
import { eq } from 'drizzle-orm'
import { applications } from "@/db/schema";

const factory = createFactory<{ Variables: { enrollement: NewEnrollement } }>();

// a transcation POST query
export const acceptApplications = factory.createHandlers((c) => {

    const applicationsId = Number(c.req.param('applicationId'));
  db.transaction(async (tx) => {
    // 1. update application status to accepted
    await tx.update(applications)
    .set({status: 'accepted'})
    .where(eq(applications.id, applicationsId));
    // 2. create enrollment record
    // 3. increment enrolledCount on the class
  });
  return c.json({ msg: "accept applications" });
});
