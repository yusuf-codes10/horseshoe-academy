import { createFactory } from "hono/factory";
import type { NewTeacher, NewNotification } from "@classroom/shared";
import { insertClassSchema } from "@classroom/shared";
import { teachers, users, classes } from "@/db/schema";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { pushNotification } from "@/services/pushNotifications";
import { zValidator } from "@hono/zod-validator";

const factory = createFactory<{ Variables: { teacher: NewTeacher } }>();

export const getAllTeacher = factory.createHandlers(async (c) => {
  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 10;
  const skip = (page - 1) * limit;

  const teachersCount = await db.$count(teachers);

  const allTeachers = await db
    .select({
      id: teachers.id,
      username: users.username,
      email: users.email,
      gender: users.gender,
      fullName: users.fullName,
      role: users.role,
      createdAt: users.createdAt,
      degree: teachers.degree,
      major: teachers.major,
      avatarPublicId: users.avatarPublicId,
      avatarUrl: users.avatarUrl,
      salary: teachers.salary,
    })
    .from(teachers)
    .innerJoin(users, eq(users.id, teachers.id))
    .offset(skip)
    .limit(limit)
    .orderBy(teachers.id);
  return c.json({ msg: "teachers: ", allTeachers, teachersCount });
});

// get teacher by id
export const getTeacherById = factory.createHandlers(async (c) => {
  const teacherId = Number(c.req.param("teacherId"));
  const [foundTeacher] = await db
    .select({
      id: teachers.id,
      username: users.username,
      email: users.email,
      gender: users.gender,
      fullName: users.fullName,
      role: users.role,
      createdAt: users.createdAt,
      degree: teachers.degree,
      major: teachers.major,
      salary: teachers.salary,
      avatarPublicId: users.avatarPublicId,
      avatarUrl: users.avatarUrl,
    })
    .from(teachers)
    .innerJoin(users, eq(users.id, teachers.id))
    .where(eq(teachers.id, teacherId));

  if (!foundTeacher)
    throw new HTTPException(404, { message: "Teacher not found!" });
  return c.json({ msg: "Found Teacher: ", foundTeacher });
});

// asign a teacher to a class
export const assignTacherToClass = factory.createHandlers(
  zValidator(
    "json",
    insertClassSchema.pick({
      teacherId: true,
    }),
  ),
  async (c) => {
    // grab the class id
    const classId = Number(c.req.param("classId"));
    const body = c.req.valid("json");

    // check if class exists
    const [foundClass] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    if (!foundClass)
      throw new HTTPException(404, { message: "class not found!" });

    // check if the teacher exists too
    const [foundTeacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, Number(body.teacherId)));

    if (!foundTeacher)
      throw new HTTPException(404, { message: "Teacher does not exist!" });

    // TODO: we need another notification here for assigning a teacher
    let updatedClass;
    await db.transaction(async (tx) => {
      // 1. assign the teacher
      [updatedClass] = await tx
        .update(classes)
        .set({ teacherId: body.teacherId })
        .where(eq(classes.id, classId))
        .returning();
      // 2. notify the teacher
      // 2. notify the user
      const notification: NewNotification = {
        title: "Assigned to A Class",
        content: "Congratulations! You have been Asigned to...",
        action: `classes/${classId}`,
        userId: body.teacherId,
        isRead: false,
      };
      await pushNotification(notification, tx);
    });

    return c.json({ msg: "teacher assigned", updatedClass });
  },
);
