import { Hono } from "hono";
// import type { Context } from "hono";
// import type { User } from "@classroom/shared";
import {
  registerSchema,
  loginSchema,
  sekishoRegisterResponseSchema,
} from "@classroom/shared";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";

const router = new Hono();

router.post("/register", zValidator("json", registerSchema), async (c) => {
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

    const data = sekishoRegisterResponseSchema.parse(raw);
    const { safeUser, token } = data;
    console.log("actual user", safeUser);
    return c.json({ user: safeUser, token });
  } catch (error) {
    console.log(error);

    throw new HTTPException(500, { message: "something went wrong" });
  }
});

router.post("/login", zValidator("json", loginSchema), async (c) => {
  try {
    const body = c.req.valid("json");

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
    console.log("actual user", safeUser);
    return c.json({ user: safeUser, token });
  } catch (error) {
    console.log(error);

    throw new HTTPException(500, { message: "something went wrong" });
  }
});

export default router;
