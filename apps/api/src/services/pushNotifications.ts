import { db } from "@/db/index";
import { notifications } from "@/db/schema";
import type { NewNotification } from '@classroom/shared';

export const pushNotification = async (
    not: NewNotification
) => {
  try {
    await db.insert(notifications).values({
      title: not.title,
      content: not.content,
      time: not.time,
      isRead: not.isRead,
      action: not.action,
      userId: not.userId,
    });
  } catch (error) {
    console.log(error);
  }
};
