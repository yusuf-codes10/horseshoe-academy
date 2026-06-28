import  { createFactory } from 'hono/factory';
import type { SekishoUser } from '@classroom/shared';
import { registerSchema, loginSchema, sekishoRegisterResponseSchema }from '@classroom/shared';
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { signToken } from '../utils/signToken';
import {db } from '../db/index';


const factory = createFactory<{Variables: {user: SekishoUser}}>();

export const registerUser = factory.createHandlers(
    // registerSchema: validates what the client sends
    zValidator("json", registerSchema), async (c) => {
  try {
    const body = c.req.valid("json");

    // const {username, password, email, fullName} = body;
    const response = await fetch("https://sekisho.onrender.com/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await response.json();
    console.log("Sekisho raw response:", JSON.stringify(raw, null, 2));
    if (!response.ok) {
      return c.json(raw, response.status as any);
    }

    // this validates what sekisho sends back
    const data = sekishoRegisterResponseSchema.parse(raw);
    const { safeUser, token } = data;
    console.log("actual user", safeUser);

    signToken(c, token);
    return c.json({ user: safeUser, token });
  } catch (error) {
    console.log(error);

    throw new HTTPException(500, { message: "something went wrong" });
  }
});

export const logUserIn = factory.createHandlers(
    zValidator("json", loginSchema), async (c) => {
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
        const { safeUser, token } = data;
        signToken(c, token);
        console.log("actual user", safeUser);
        return c.json({ user: safeUser, token });
      } catch (error) {
        console.log(error);

        throw new HTTPException(500, { message: "something went wrong" });
      }
    }
)