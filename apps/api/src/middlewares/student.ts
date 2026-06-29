import type {Context, Next} from 'hono';
import { HTTPException } from 'hono/http-exception';

export const isStudent = async (c: Context, next: Next) => {
    const user = c.get('jwtPayload'); // should read this automatically from the auth middleware
    if (user.role !== 'student') {
        throw new HTTPException(403, { message: "students only" });
    }
    await next();
}