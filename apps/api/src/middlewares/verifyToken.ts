// middlewares/auth.middleware.ts
import { jwt } from 'hono/jwt';

export const verifyToken = jwt({
  secret: process.env.JWT_SECRET!,
});