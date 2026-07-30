import { createFactory } from "hono/factory";
import type { NewUser, NewStudent, NewTeacher } from "@classroom/shared";
import { db } from "@/db/index";
import { users, teachers, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { JWTPayloadShape } from "@classroom/shared";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { editUserSchema } from "@classroom/shared";

const factory = createFactory<{
  Variables: { user: (NewUser & NewStudent) | (NewUser & NewTeacher) };
}>();

// get my profile controller
export const getMyProfile = factory.createHandlers(async (c) => {
  // grab the user id only from the auth middleware
  const payload = c.get("jwtPayload") as JWTPayloadShape;

  try {
    const [baseUser] = await db
      .select({
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt,
        gender: users.gender,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, payload.id));

    if (!baseUser)
      throw new HTTPException(404, { message: "User does not exist!" });

    // teacher
    if (baseUser.role === "teacher") {
      const [foundUser] = await db
        .select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          email: users.email,
          createdAt: users.createdAt,
          gender: users.gender,
          role: users.role,

          // teacher fields
          degree: teachers.degree,
          major: teachers.major,
          salary: teachers.salary,
        })
        .from(users)
        .innerJoin(teachers, eq(teachers.id, users.id))
        .where(eq(users.id, payload.id));
      return c.json({ msg: "user profile: ", foundUser });
    }
    // student
    else if (baseUser.role === "student") {
      const [foundUser] = await db
        .select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          email: users.email,
          createdAt: users.createdAt,
          gender: users.gender,
          role: users.role,

          // student fields
          gpa: students.gpa,
        })
        .from(users)
        .innerJoin(students, eq(students.id, users.id))
        .where(eq(users.id, payload.id));
      return c.json({ msg: "user profile: ", foundUser });
    }
    // admin
    else {
      const foundUser = baseUser;
      return c.json({ msg: "user profile: ", foundUser });
    }
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.log(error);
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// get another user
export const getUserProfile = factory.createHandlers(async (c) => {
  const username = c.req.param("username");

  if (!username)
    throw new HTTPException(400, { message: "username is required!" });

  const payload = c.get('jwtPayload') as JWTPayloadShape;
  try {
    const [baseUser] = await db
      .select({
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt,
        gender: users.gender,
        role: users.role,
      })
      .from(users)
      .where(eq(users.username, username));

    if (!baseUser)
      throw new HTTPException(404, { message: "User does not exist!" });

    if (baseUser.role === 'teacher') {
      const [foundUser] = await db
        .select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          email: users.email,
          createdAt: users.createdAt,
          gender: users.gender,
          role: users.role,

          // teacher fields
          degree: teachers.degree,
          major: teachers.major,
          salary: teachers.salary,
        })
        .from(users)
        .innerJoin(teachers, eq(teachers.id, users.id))
        .where(eq(users.id, payload.id));
      return c.json({ msg: "user profile: ", foundUser });
    }
    return c.json({ msg: "user: ", baseUser });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.log(error);
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// edit user profile
export const editUserProfile = factory.createHandlers(
  zValidator("json", editUserSchema),
  async (c) => {
    const data = c.req.valid("json");

    // starting with the fullName and the username only
    const payload = c.get("jwtPayload") as JWTPayloadShape;

    try {
      // 1- verify user actually exit
      const [profileToEdit] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.id));

      if (!profileToEdit)
        throw new HTTPException(404, { message: "user does not exist!" });

      // grab the value (actually we do not need to grab any data)
      await db.update(users).set(data).where(eq(users.id, profileToEdit.id));

      const [updatedUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.id));

      return c.json({ msg: "profile has been updated!", updatedUser });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      console.log(error);
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);
// TODO: inner joins to return full users based on role <Teacher | Student | Admin>
