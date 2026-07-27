import { createFactory } from "hono/factory";
import type { NewEnrollement } from "@classroom/shared";
import { db } from "@/db/index";

const factory = createFactory<{ Variables: { enrollement: NewEnrollement } }>();

// a transcation POST query
export const acceptApplications = factory.createHandlers((c) => {
  db.transaction(async (tx) => {
    // 1. update application status to accepted
    // 2. create enrollment record
    // 3. increment enrolledCount on the class
  });
  return c.json({ msg: "accept applications" });
});
