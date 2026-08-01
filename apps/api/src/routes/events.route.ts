import { Hono } from "hono";
import { sendNotification } from "@/events/notifications.event";
import { verify } from "hono/jwt";

const router = new Hono();

router.get("/", async (c, next) => {
    const token = c.req.query("token");
    if (!token) return c.json({ message: "Unauthorized" }, 401);
    const payload = await verify(token, process.env.JWT_SECRET!);
    c.set("jwtPayload", payload);
    return next();
}, ...sendNotification);

export default router;