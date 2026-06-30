import { Hono } from 'hono';
import { createClass } from '../controllers/classes.controller';

const router = new Hono();

// create a class
router.post('/', ...createClass);

// assign a teacher to a class
router.patch('/');

export default router;