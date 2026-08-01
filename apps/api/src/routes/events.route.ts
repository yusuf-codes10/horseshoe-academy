import { Hono } from "hono";
import { sendNotification } from "@/events/notifications.event";
import { verifyToken } from "@/middlewares/verifyToken";

const router = new Hono();

router.get(
  "/",
  (c, next) => {
    console.log("cookies:", c.req.header("cookie"));
    return next();
  },
  verifyToken,
  ...sendNotification,
);

export default router;
