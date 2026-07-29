import { notifications } from "@/db/schema";
import { db } from "@/db/index";
import type { NewNotification } from "@classroom/shared";
import { HTTPException } from "hono/http-exception";

import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

type Transaction = Parameters<Parameters<NodePgDatabase["transaction"]>[0]>[0];

export const pushNotification = async (
  tx?: Transaction,
  notification: NewNotification,
) => {
  try {
    const [insertedNotification] =
      (await tx) ??
      db
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
