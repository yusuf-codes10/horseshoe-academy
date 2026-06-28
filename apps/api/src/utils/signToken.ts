// setting a cookie with the hono helper
import { setCookie } from "hono/cookie";

export const signToken = (c: any, token: any) => {
  setCookie(c, "auth", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 60 * 60 * 24 * 7,
  });
};
