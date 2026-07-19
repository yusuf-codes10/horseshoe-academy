import { Hono } from 'hono';
import { getMyProfile } from '@/controllers/users.controller';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// using the auth middleware with every single one of these routes
router.use('*', verifyToken);

// get my profile /me
router.get('/me', ...getMyProfile);

// delete my profile
router.delete('/me');

// update my profile
router.patch('/me');

export default router;