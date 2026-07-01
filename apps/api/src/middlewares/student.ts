import type {Context, Next} from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { JwtVariables } from 'hono/jwt';

type AuthContext = Context<{Variables: JwtVariables}>;

export const isStudent = async (c: AuthContext, next: Next) => {
    const paylaod = c.get('jwtPayload'); // should read this automatically from the auth middleware
    if (paylaod.role !== 'student') {
        throw new HTTPException(403, { message: "students only" });
    }
    await next();
}