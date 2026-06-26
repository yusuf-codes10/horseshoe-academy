// the database schema is going to be here
import {
  bigserial,
  pgTable,
  decimal,
  bigint,
  text,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["admin", "teacher", "student"]);

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  fullName: text("fullName"),
  role: roleEnum("role"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// 1-on-1 relationship to respresent inheritance
export const teachers = pgTable("teachers", {
  id: bigserial("id", { mode: "number" })
    .primaryKey()
    .references(() => users.id),
  degree: varchar("degree", { length: 255 }).notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
});

export const students = pgTable("students", {
  id: bigserial("id", { mode: "number" })
    .primaryKey()
    .references(() => users.id),
  gpa: decimal("gpa", { precision: 10, scale: 2 }).notNull(),
});

// other tables
export const departements = pgTable("departements", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 7 }).notNull().unique(),
  name: varchar("name", { length: 50 }).notNull(),
});

export const subjects = pgTable("subjects", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 20 }).notNull(),
  description: text("descriptions"),
  departement_id: bigint("departement_id").references(() => departements.id),
});

// expandable
// export const teacherRelations = relations(teachers, ({one}) => ({users: one(users)}));
