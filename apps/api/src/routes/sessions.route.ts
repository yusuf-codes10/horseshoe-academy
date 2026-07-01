import { Hono } from 'hono';
import { createSession, getSessionPerClass, getSessionById } from '../controllers/sessions.controller';

const router = new Hono();

// create a session
router.post('/', ...createSession);

// get all sessions per class
router.get('/', ...getSessionPerClass);

// get a single session by id
router.get('/:sessionId', ...getSessionById);

export default router;