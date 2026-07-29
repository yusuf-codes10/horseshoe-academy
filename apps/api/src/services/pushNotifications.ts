import { db } from "@/db/index";
import { notifications } from "@/db/schema";

export const pushNotification = async (
  title: string,
  content: string,
  time: string,
  isRead: boolean,
  action: string,
  userId: number,
) => {
  try {
    await db.insert(notifications).values({
      title: title,
      content: content,
      time: time,
      isRead: isRead,
      action: action,
      userId: userId,
    });
  } catch (error) {
    console.log(error);
  }
};
