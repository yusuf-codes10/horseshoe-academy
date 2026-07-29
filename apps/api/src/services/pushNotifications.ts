import { db } from "@/db/index";
import { notifications } from "@/db/schema";
import type { NewNotification } from "@classroom/shared";
import { HTTPException } from "hono/http-exception";

export const pushNotification = async (notification: NewNotification) => {
  try {
    const [insertedNotification] = await db
      .insert(notifications)
      .values({
        title: notification.title,
        content: notification.content,
        time: notification.time,
        isRead: notification.isRead,
        action: notification.action,
        userId: notification.userId,
      })
      .returning();

    if (!insertedNotification)
      throw new HTTPException(500, { message: "Could not insert!" });

    return insertedNotification;
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
};
