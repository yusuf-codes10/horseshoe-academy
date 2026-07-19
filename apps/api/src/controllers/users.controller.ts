import { createFactory } from "hono/factory";
import type { NewUser, NewStudent, NewTeacher } from "@classroom/shared";
import { db } from "@/db/index";
import { users, teachers, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { JWTPayloadShape } from "@classroom/shared";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{
  Variables: { user: (NewUser & NewStudent) | (NewUser & NewTeacher) };
}>();

// get my profile controller
export const getMyProfile = factory.createHandlers(async (c) => {
  // grab the user id only from the auth middleware
  const payload = c.get("jwtPayload") as JWTPayloadShape;

  try {
    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id));
    return c.json({ msg: "user profile: ", foundUser });
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
  try {
    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!foundUser)
      throw new HTTPException(404, { message: "User does not exist!" });
    return c.json({ msg: "user: ", foundUser });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.log(error);
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
