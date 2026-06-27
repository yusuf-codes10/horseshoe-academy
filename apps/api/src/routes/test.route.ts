import { Hono } from "hono";
import type { Context } from "hono";
// import type { User } from "@classroom/shared";
import { selectUserSchema } from "@classroom/shared";
import { HTTPException } from "hono/http-exception";

const router = new Hono();

router.get("/", async (c: Context) => {
  try {
    const response = await fetch("https://sekisho.onrender.com/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok) {
        console.log("HTTP Error:", response.status, response.statusText);
      console.log("Response body:", data);
    }

    console.log('raw data', data);

    const user = selectUserSchema.parse(data);
    console.log('actual error', user);
    return c.json({ msg: "Hello, is everything working?", user });
  } catch (error) {
    console.log(error);

    throw new HTTPException(500, { message: "something went wrong" });
  }
});

export default router;
