import type {Context, Next} from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { JwtVariables } from 'hono/jwt';

type AuthContext = Context<{Variables: JwtVariables}>;

export const isAdmin = async (c: AuthContext, next: Next) => {
    const payload = c.get('jwtPayload'); // should read this automatically from the auth middleware
    console.log('payload', payload);
    console.log('role', payload.role);
    if (payload.role !== 'admin') {
        throw new HTTPException(403, { message: "admins only" });
    }
    await next();
}