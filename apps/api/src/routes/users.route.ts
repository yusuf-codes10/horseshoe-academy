import { Hono } from 'hono';
import { getMyProfile, getUserProfile, editUserProfile } from '@/controllers/users.controller';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// using the auth middleware with every single one of these routes
router.use('*', verifyToken);

// get my profile /me
router.get('/me', ...getMyProfile);

// get another user (view his profile)
router.get('/:username', ...getUserProfile);

// delete my profile
router.delete('/me');

// update my profile
router.patch('/me', ...editUserProfile);

export default router;