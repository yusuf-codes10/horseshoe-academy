import { notifications } from "@/db/schema";
import { db } from "@/db/index";
import type { NewNotification } from "@classroom/shared";
import { HTTPException } from "hono/http-exception";
import { activeConnections } from "@/events";

export const pushNotification = async (
  notification: NewNotification,
  tx?: any,
) => {
  const client = tx ?? db;
  try {
    const [insertedNotification] = await client
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

    // pushing to the SSE service
    if (notification.userId) {
      const connection = activeConnections.get(notification.userId);
      console.log("active connections:", activeConnections);
      console.log("looking for userId:", notification.userId);
      console.log("found connection:", connection);

      if (connection) {
        await connection.writeSSE({
          data: JSON.stringify({ type: "new_notification" }),
        });
      }
    }

    return insertedNotification;
  } catch (error) {
    console.log(error);
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: "something went wrong" });
  }
};
