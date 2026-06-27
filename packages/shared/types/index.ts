import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  users, teachers, students, departments,
  subjects, classes, sessions, applications,
  enrollements, attendances, notifications
} from "../../../apps/api/src/db/schema";

// Users
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Teachers
export type Teacher = InferSelectModel<typeof teachers>;
export type NewTeacher = InferInsertModel<typeof teachers>;

// Students
export type Student = InferSelectModel<typeof students>;
export type NewStudent = InferInsertModel<typeof students>;

// Departments
export type Department = InferSelectModel<typeof departments>;
export type NewDepartment = InferInsertModel<typeof departments>;

// Subjects
export type Subject = InferSelectModel<typeof subjects>;
export type NewSubject = InferInsertModel<typeof subjects>;

// Classes
export type Class = InferSelectModel<typeof classes>;
export type NewClass = InferInsertModel<typeof classes>;

// Sessions
export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

// Applications
export type Application = InferSelectModel<typeof applications>;
export type NewApplication = InferInsertModel<typeof applications>;

// Enrollements
export type Enrollement = InferSelectModel<typeof enrollements>;
export type NewEnrollement = InferInsertModel<typeof enrollements>;

// Attendances
export type Attendance = InferSelectModel<typeof attendances>;
export type NewAttendance = InferInsertModel<typeof attendances>;

// Notifications
export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;