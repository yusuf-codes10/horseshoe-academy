import { Hono } from 'hono';
import { getMyProfile } from '@/controllers/users.controller';

const router = new Hono();

// get my profile /me
router.get('/me', ...getMyProfile);

// delete my profile
router.delete('/me');

// update my profile
router.patch('/me');

export default router;