import { z } from "zod";
import {
  selectUserSchema,
  insertUserSchema,
  selectTeacherSchema,
  insertTeacherSchema,
  selectStudentSchema,
  insertStudentSchema,
  selectDepartmentSchema,
  insertDepartmentSchema,
  selectSubjectSchema,
  insertSubjectSchema,
  selectClassSchema,
  insertClassSchema,
  selectSessionSchema,
  insertSessionSchema,
  selectApplicationSchema,
  insertApplicationSchema,
  selectEnrollementSchema,
  insertEnrollementSchema,
  selectAttendanceSchema,
  insertAttendanceSchema,
  selectNotificationSchema,
  insertNotificationSchema,
} from "../validation";

// Users
export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;

// Teachers
export type Teacher = z.infer<typeof selectTeacherSchema>;
export type NewTeacher = z.infer<typeof insertTeacherSchema>;

// Students
export type Student = z.infer<typeof selectStudentSchema>;
export type NewStudent = z.infer<typeof insertStudentSchema>;

// Departments
export type Department = z.infer<typeof selectDepartmentSchema>;
export type NewDepartment = z.infer<typeof insertDepartmentSchema>;

// Subjects
export type Subject = z.infer<typeof selectSubjectSchema>;
export type NewSubject = z.infer<typeof insertSubjectSchema>;

// Classes
export type Class = z.infer<typeof selectClassSchema>;
export type NewClass = z.infer<typeof insertClassSchema>;

// Sessions
export type Session = z.infer<typeof selectSessionSchema>;
export type NewSession = z.infer<typeof insertSessionSchema>;

// Applications
export type Application = z.infer<typeof selectApplicationSchema>;
export type NewApplication = z.infer<typeof insertApplicationSchema>;

// Enrollements
export type Enrollement = z.infer<typeof selectEnrollementSchema>;
export type NewEnrollement = z.infer<typeof insertEnrollementSchema>;

// Attendances
export type Attendance = z.infer<typeof selectAttendanceSchema>;
export type NewAttendance = z.infer<typeof insertAttendanceSchema>;

// Notifications
export type Notification = z.infer<typeof selectNotificationSchema>;
export type NewNotification = z.infer<typeof insertNotificationSchema>;

// validation for registering a user
export const registerSchema = insertUserSchema
  .pick({
    username: true,
    email: true,
    gender: true,
    fullName: true, // optional anyway
    role: true, // optional anyway
  })
  .extend({
    password: z.string().min(8),
    gpa: z.string().optional(),
    degree: z.enum(['Associate', "Bachelor's", "Master's", 'PhD']).optional(),
    major: z.string().optional(),
  });

export const loginSchema = insertUserSchema
  .pick({
    username: true,
  })
  .extend({
    password: z.string().min(8),
  });

// sekisho schema
// user
export const sekishoUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  fullName: z.string().nullable(),
  createdAt: z.string(), // Sekisho returns string not Date
});

// full object
export const sekishoRegisterResponseSchema = z.object({
  safeUser: sekishoUserSchema,
  token: z.string(),
});

// infered types
export type SekishoUser = z.infer<typeof sekishoUserSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

// more types
export type JWTPayloadShape = {
  id: number;
  username: string;
  email: string;
  role: string;
  exp: number;
};

// more types
// ! using discriminated union
export type generalUser = RegisterDTO &
  (
    | { role: "admin"; gpa?: never; degree?: never; major?: never }
    | { role: "student"; gpa: number; degree?: never; major?: never }
    | { role: "teacher"; gpa?: never; degree: string; major: string }
  );
