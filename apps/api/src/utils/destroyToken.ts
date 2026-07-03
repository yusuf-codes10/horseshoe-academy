import { deleteCookie } from "hono/cookie";
import type { Context } from "hono";

export const clearToken = (c: Context) => {
  deleteCookie(c, "auth", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
};
