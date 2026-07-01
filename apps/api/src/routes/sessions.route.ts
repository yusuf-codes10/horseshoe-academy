import { Hono } from 'hono';

const router = new Hono();

// create a session
router.post('/');

// get all sessions
router.get('/');

export default router;