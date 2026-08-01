import { createFactory } from "hono/factory";
import type { NewNotification, JWTPayloadShape } from "@classroom/shared";
import { notifications } from "@/db/schema";
import { db } from "@/db/index";
import { eq, and } from "drizzle-orm";
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
  const notificationId = c.req.param("notificationId");
  const payload = c.get("jwtPayload") as JWTPayloadShape;
  try {
    // 1. making sure the notification exists
    const [foundNotification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, Number(notificationId)));

    if (!foundNotification)
      throw new HTTPException(404, { message: "Notification not found!" });

    // 2. reading the notification
    const [readNotification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, Number(notificationId)),
          eq(notifications.userId, payload.id),
        ),
      )
      .returning();
    if (!readNotification)
      throw new HTTPException(500, { message: "Oops! Somthing went wrong!" });
    return c.json({ msg: "notification has been read!" });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

export const deleteMyNotification = factory.createHandlers(async (c) => {
  const notificationId = c.req.param("notificationId");
  const payload = c.get("jwtPayload") as JWTPayloadShape;
  try {
    // check if the notification exists (just in case)
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, payload.id));

    if (!notification)
      throw new HTTPException(404, { message: "notification does not exist!" });

    // deleting the notification
    const [deleted] = await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.id, Number(notificationId)),
          eq(notifications.userId, payload.id),
        ),
      )
      .returning();

    if (!deleted)
      throw new HTTPException(500, { message: "Something went wrong!" });
    return c.json({ msg: "notification has been deleted!" });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});

// TODO: temporarily get counnt
export const getMyNotificationsCount = factory.createHandlers(async (c) => {
  const payload = c.get("jwtPayload") as JWTPayloadShape;
  try {
    await db
      .$count(notifications)
      .where(eq(notifications.id, Number(payload.id)));
    return c.json({ msg: "count is: " });
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
});
