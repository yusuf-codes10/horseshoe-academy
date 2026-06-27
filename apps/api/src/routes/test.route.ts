import { Hono } from "hono";
import type { Context } from "hono";
// import type { User } from "@classroom/shared";
import { selectUserSchema } from "@classroom/shared";
import { HTTPException } from "hono/http-exception";

const router = new Hono();

router.get("/", async (c: Context) => {
  try {
    const response = await fetch("https://sekisho.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const user = selectUserSchema.parse(data);
    console.log(user);
  } catch (error) {
    console.log(error);

    throw new HTTPException(500, { message: "something went wrong" });
  }
  return c.json({ msg: "Hello, is everything working?" });
});

export default router;
