import { Hono } from 'hono';
import { createSession, getSessionPerClass, getSessionById, deleteSession } from '@/controllers/sessions.controller';

const router = new Hono();

// create a session
router.post('/', ...createSession);

// get all sessions per class
router.get('/', ...getSessionPerClass);

// get a single session by id
router.get('/:sessionId', ...getSessionById);

// get all sessions
router.get('/');

// delete a session
router.delete('/:sessionId', ...deleteSession);

export default router;