import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  users, teachers, students, departments,
  subjects, classes, sessions, applications,
  enrollements, attendances, notifications
} from "../../../apps/api/src/db/schema";

// Users
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

// Teachers
export const selectTeacherSchema = createSelectSchema(teachers);
export const insertTeacherSchema = createInsertSchema(teachers).omit({id: true});

// Students
export const selectStudentSchema = createSelectSchema(students);
export const insertStudentSchema = createInsertSchema(students).omit({id: true});

// Departments
export const selectDepartmentSchema = createSelectSchema(departments);
export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true });

// Subjects
export const selectSubjectSchema = createSelectSchema(subjects);
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true })

// Classes
export const selectClassSchema = createSelectSchema(classes);
export const insertClassSchema = createInsertSchema(classes).omit({ id: true })

// Sessions
export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true })

// Applications
export const selectApplicationSchema = createSelectSchema(applications);
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true })

// Enrollements
export const selectEnrollementSchema = createSelectSchema(enrollements);
export const insertEnrollementSchema = createInsertSchema(enrollements).omit({ id: true })

// Attendances
export const selectAttendanceSchema = createSelectSchema(attendances);
export const insertAttendanceSchema = createInsertSchema(attendances).omit({ id: true })

// Notifications
export const selectNotificationSchema = createSelectSchema(notifications);
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true })