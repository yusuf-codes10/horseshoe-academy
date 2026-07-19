import { Hono } from 'hono';

const router = new Hono();

// get my profile /me
router.get('/');

// delete my profile
router.delete('/');

// update my profile
router.patch('/');

export default router;