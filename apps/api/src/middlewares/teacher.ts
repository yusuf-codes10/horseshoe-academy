import type {Context, Next} from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { JwtVariables } from 'hono/jwt';

// a version of Context where it knows JwtVariables
type AuthContext = Context<{Variables: JwtVariables}>;

export const isTeacher = async (c: AuthContext, next: Next) => {
    const payload = c.get('jwtPayload'); // should read this automatically from the auth middleware
    if (payload.role !== 'teacher') {
        throw new HTTPException(403, { message: "teachers only" });
    }
    await next();
}