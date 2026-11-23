import { createFactory } from "hono/factory";
import type {
  NewUser,
  NewStudent,
  NewTeacher,
  JWTPayloadShape,
} from "@classroom/shared";
import { db } from "@/db/index";
import { users, teachers, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { editUserSchema } from "@classroom/shared";
import { uploadImage } from "@/libs/cloudinary";

const factory = createFactory<{
  Variables: { user: (NewUser & NewStudent) | (NewUser & NewTeacher) };
}>();

// get my profile controller
export const getMyProfile = factory.createHandlers(async (c) => {
  // grab the user id only from the auth middleware
  const payload = c.get("jwtPayload") as JWTPayloadShape;

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
});

// get another user
export const getUserProfile = factory.createHandlers(async (c) => {
  const username = c.req.param("username");

  if (!username)
    throw new HTTPException(400, { message: "username is required!" });

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
      .where(eq(users.id, baseUser.id));
    return c.json({ msg: "user profile: ", foundUser });
  } // student
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
      .where(eq(users.id, baseUser.id));
    return c.json({ msg: "user profile: ", foundUser });
  }
  // admin
  else {
    const foundUser = baseUser;
    return c.json({ msg: "user profile: ", foundUser });
  }
});

// edit user profile
export const editUserProfile = factory.createHandlers(
  zValidator("form", editUserSchema),
  async (c) => {
    const data = c.req.valid("form");

    // starting with the fullName and the username only
    const payload = c.get("jwtPayload") as JWTPayloadShape;

    // 1- verify user actually exit
    const [profileToEdit] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id));

    if (!profileToEdit)
      throw new HTTPException(404, { message: "user does not exist!" });

    const updates: Partial<typeof users.$inferInsert> = { ...data };

    // avatar (optional)
    const body = await c.req.parseBody();
    const file = body["avatar"];

        if (file instanceof File) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
        throw new HTTPException(400, { message: "Invalid image type" });
      if (file.size > 2 * 1024 * 1024)
        throw new HTTPException(400, { message: "Image must be under 2MB" });

      const { secure_url, public_id } = await uploadImage(file);
      updates.avatarUrl = secure_url;
      updates.avatarPublicId = public_id;
    }

    if (Object.keys(updates).length === 0)
      throw new HTTPException(400, { message: "Nothing to update" });

    // grab the value (actually we do not need to grab any data)
    await db.update(users).set(data).where(eq(users.id, profileToEdit.id));

    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id));

    return c.json({ msg: "profile has been updated!", updatedUser });
  },
);
// TODO: inner joins to return full users based on role <Teacher | Student | Admin>
