// setting a cookie with the hono helper
import { setCookie } from "hono/cookie";
import type { Context } from "hono";

export const signToken = (c: Context, token: string) => {
  setCookie(c, "auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    maxAge: 60 * 60 * 24 * 7,
  });
};
