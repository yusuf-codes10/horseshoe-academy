import { Hono } from 'hono';
import { createSession } from '../controllers/sessions.controller';

const router = new Hono();

// create a session
router.post('/', ...createSession);

// get all sessions per class
router.get('/');

// get a single session by id
router.get('/:sessionId');

export default router;