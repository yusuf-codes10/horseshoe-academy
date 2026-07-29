import { Hono } from 'hono';

const router = new Hono();

// create a notification
router.post('/');

export default router;