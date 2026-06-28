// setting a cookie with the hono helper
import { setSignedCookie } from "hono/cookie";

const secret = process.env.JWT_TOKEN!;

export const signToken = async(c, token) => {
    
}