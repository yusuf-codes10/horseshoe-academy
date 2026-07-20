import { createFactory } from "hono/factory";
import type { SekishoUser } from "@classroom/shared";
import {
  registerSchema,
  loginSchema,
  sekishoRegisterResponseSchema,
} from "@classroom/shared";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/index";
import { users, students, teachers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { clearToken } from "@/utils/destroyToken";
import { issueSession } from '@/utils/issueSession';
import type { JWTPayloadShape, generalUser } from "@classroom/shared";

const factory = createFactory<{ Variables: { user: SekishoUser } }>();

export const registerUser = factory.createHandlers(
  // registerSchema: validates what the client sends
  zValidator("json", registerSchema),
  async (c) => {
    console.log(process.env.DATABASE_URL);
    try {
      const body = c.req.valid("json");

      // const {username, password, email, fullName} = body;
      const response = await fetch(
        "https://sekisho.onrender.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const raw = await response.json();
      console.log("Sekisho raw response:", JSON.stringify(raw, null, 2));
      if (!response.ok) {
        return c.json(raw, response.status as any);
      }

      // this validates what sekisho sends back
      const data = sekishoRegisterResponseSchema.parse(raw);
      const { safeUser } = data;
      console.log("actual user", safeUser);

      // check classroom db
      try {
        const [duplicateUser] = await db
          .select()
          .from(users)
          .where(eq(users.username, safeUser.username));

        if (duplicateUser)
          throw new HTTPException(400, { message: "username already exits!" });

        const [newUser] = await db
          .insert(users)
          .values({
            id: safeUser.id,
            username: safeUser.username,
            email: safeUser.email,
            fullName: safeUser.fullName,
            gender: body.gender,
            role: body.role,
          })
          .returning();

        // insert to db based on role
        // leaving teachers for later
        if (newUser?.role === "student") {
            await db.insert(students).values({
              id: newUser.id,
              gpa: body.gpa
            });
            console.log("student inserted successfully");
        }

        // if a teacher insert here
        // TODO: should grab the data from the bodies when the role is a teacher!
        if (newUser?.role === 'teacher') {
          await db.insert(teachers).values({
            id: newUser.id,
            salary: '20000',
            major: 'Computer Science'
          })
        }

        console.log(newUser);
        if (!newUser) {
          throw new HTTPException(500, { message: "failed to create user" });
        }
        // creating our own token first, and sign in that in one go
        await issueSession(c, {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          // add the role here
          role: newUser.role
        });
        return c.json({ user: newUser });
      } catch (dbError) {
        console.log("failed inserting user", dbError);
        if (dbError instanceof HTTPException) throw dbError;
        throw new HTTPException(500, {
          message: "registered but classroom setup failed",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);

export const logUserIn = factory.createHandlers(
  zValidator("json", loginSchema),
  async (c) => {
    try {
      const body = c.req.valid("json");
      console.log("Sekisho raw response:", JSON.stringify(body, null, 2));
      const response = await fetch("https://sekisho.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const raw = await response.json();

      if (!response.ok) {
        return c.json(raw, response.status as any);
      }
      const data = sekishoRegisterResponseSchema.parse(raw);
      const { safeUser } = data;

      // deal with classroom db
      try {
        // find user in db
        const [foundUser] = await db
          .select()
          .from(users)
          .where(eq(users.username, safeUser.username));

        if (!foundUser)
          throw new HTTPException(404, {
            message: "username does not exist! Please, Reister first",
          });
          // create & sign the JWT token
        await issueSession(c, {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          role: foundUser.role
        });
        console.log("actual user", foundUser);
        return c.json({ user: foundUser });
      } catch (dbError) {
        console.log("failed inserting user", dbError);
        if (dbError instanceof HTTPException) throw dbError; // ← let it bubble up
        throw new HTTPException(500, {
          message: "registered but classroom setup failed",
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;

      throw new HTTPException(500, { message: "something went wrong" });
    }
  },
);

// /me controller
export const verifyUser = factory.createHandlers(async (c) => {
  const payload = c.get("jwtPayload") as JWTPayloadShape;
  // we have to return a user not what the jwt decoded!
  const [user] = await db.select()
  .from(users)
  .where(eq(users.id, payload.id))
  console.log('user is: ', user);
  console.log('payload is ', payload);
  return c.json({ user });
});

// logout | destroy the cookie
export const logout = factory.createHandlers((c) => {
  clearToken(c);
  return c.json({ msg: "logged out succesfuly!" });
});
