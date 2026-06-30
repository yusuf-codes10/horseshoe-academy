import { Hono } from 'hono';

const router = new Hono();

// create a subject
router.post('/');

export default router;