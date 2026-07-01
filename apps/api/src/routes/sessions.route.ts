import { Hono } from 'hono';
import { createSession } from '../controllers/sessions.controller';

const router = new Hono();

// create a session
router.post('/', ...createSession);

// get all sessions
router.get('/');

export default router;