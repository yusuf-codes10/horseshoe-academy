import { Hono } from 'hono';

const router = new Hono();

// create a class
router.post('/');

// assign a teacher to a class
router.patch('/');

export default router;