// the database schema is going to be here
import {
  bigserial,
  pgTable,
  decimal,
  bigint,
  text,
  varchar,
  timestamp,
  date,
  pgEnum,
  unique,
  boolean
} from "drizzle-orm/pg-core";

// ! have to export the enums
export const roleEnum = pgEnum("role", ["admin", "teacher", "student"]);
export const statusEnum = pgEnum('status', ['pending', 'accepted', 'rejected']);
export const degreeEnum = pgEnum("degree", [
  "Associate",
  "Bachelor's",
  "Master's",
  "PhD",
]);
export const genderEnum = pgEnum('gender', ['female', 'male']);
export const sessionEnum = pgEnum('session_status',['active', 'upcoming', 'completed']);

export const users = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  gender: genderEnum('gender').notNull(),
  fullName: text("fullName"),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

// 1-on-1 relationship to respresent inheritance
export const teachers = pgTable("teachers", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .references(() => users.id),
  degree: degreeEnum('degree').notNull().default('Associate'),
  major: varchar('major', {length: 30}).notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
});

export const students = pgTable("students", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .references(() => users.id),
  gpa: decimal("gpa", { precision: 10, scale: 2 }),
});

// other tables
export const departments = pgTable("departments", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 7 }).notNull().unique(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text('description')
});

export const subjects = pgTable("subjects", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 20 }).notNull(),
  description: text("descriptions"),
  departmentId: bigint("department_id", {mode: 'number'}).references(() => departments.id),
});

export const classes = pgTable('classes', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    capacity: bigint('capacity', {mode: 'number'}).notNull(),
    code: text('code').unique().notNull(),
    description: text('description'),
    enrolledCount: bigint('enrolled_count', {mode: 'number'}).notNull().default(0),
    subjectId: bigint('subject_id', {mode: 'number'}).references(() => subjects.id),
    teacherId: bigint('teacher_id', { mode: 'number'}).references(() => teachers.id)
})

export const sessions = pgTable('sessions', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    name: varchar('name', {length: 30}),
    date: date('date').notNull(),
    location: text('location').notNull(),
    status: sessionEnum().notNull().default('upcoming'),
    classId: bigint('class_id', {mode: 'number'}).references(() => classes.id)
})

// conjuction tables
export const applications = pgTable('applications', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    status: statusEnum('status').notNull().default('pending'),
    studentId: bigint('student_id', {mode: 'number'}).references(() => students.id),
    classId: bigint('class_id', {mode: 'number'}).references(() => classes.id)
},
  (table) => [
    unique("applications_student_class_unique").on(
      table.studentId,
      table.classId
    ),
  ])

export const enrollements = pgTable('enrollements', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    studentId: bigint('student_id', {mode: 'number'}).references(() => students.id),
    classId: bigint('class_id', {mode: 'number'}).references(() => classes.id)
})

export const attendances = pgTable('attendances', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    enrollId: bigint('enroll_id', {mode: 'number'}).references(() => enrollements.id),
    sessionId: bigint('session_id', {mode: 'number'}).references(() => sessions.id)
})

// extra
export const notifications = pgTable('notifications', {
    id: bigserial('id', {mode: 'number'}).primaryKey(),
    title: varchar('title', {length: 20}).notNull(),
    content: text('content').notNull(),
    time: timestamp('time').defaultNow().notNull(),
    isRead: boolean('is_read'),
    userId: bigint('user_id', {mode: 'number'}).references(() => users.id)
})
