import { Hono } from 'hono';

const router = new Hono();

// post enrollemetns
router.post('/enrollements');

export default router;