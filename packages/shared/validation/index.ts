import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  users, teachers, students, departments,
  subjects, classes, sessions, applications,
  enrollements, attendances, notifications
} from "../../../apps/api/src/db/schema";

// Users
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
