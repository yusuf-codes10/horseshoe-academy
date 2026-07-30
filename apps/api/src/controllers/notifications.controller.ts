import { createFactory } from "hono/factory";
import type { NewNotification } from "@classroom/shared";
import { applications, notifications } from "@/db/schema";
import { db } from "@/db/index";
import type { JWTPayloadShape } from "@classroom/shared";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const factory = createFactory<{
  Variables: { notification: NewNotification };
}>();

// get My notifications: GET
export const getMyNotifications = factory.createHandlers(async (c) => {
  const payload = c.get("jwtPayload") as JWTPayloadShape;

  const pageQuery = c.req.query("page");
  const limitQuery = c.req.query("limit");

  const page = Number(pageQuery) || 1;
  const limit = Number(limitQuery) || 5;
  const skip = (page - 1) * limit;
  try {
    const allNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, payload.id))
      .offset(skip)
      .limit(limit)
      .orderBy(notifications.id);

    return c.json({ msg: "notifications", allNotifications });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// patch, read
export const readMyNotification = factory.createHandlers(async (c) => {
  const notificationId = c.req.param('notificationId');
  try {
    await db.update(notifications)
    .set({isRead: true})
    .where(eq(applications.id, Number(notificationId)));
    return c.json({ msg: "notification has been read!" });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

export const deleteMyNotification = factory.createHandlers((c) => {
  return c.json({ msg: "notification has been deleted!" });
});
