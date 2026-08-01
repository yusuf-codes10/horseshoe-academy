import { Hono } from "hono";
import {
  registerUser,
  logUserIn,
  verifyUser,
  logout,
} from "@/controllers/auth.controller";
import { verifyToken } from "@/middlewares/verifyToken";
import { sign } from "hono/jwt";
import type { JWTPayloadShape } from "@classroom/shared";

const router = new Hono();

router.post("/register", ...registerUser);

router.post("/login", ...logUserIn);

router.get("/me", verifyToken, ...verifyUser);

router.post("/logout", ...logout);

router.get("/sse-token", verifyToken, async (c) => {
  const payload = c.get("jwtPayload") as JWTPayloadShape;
  const token = await sign(
    {
      id: payload.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    },
    process.env.JWT_SECRET!,
  );
  return c.json({ token });
});
export default router;
