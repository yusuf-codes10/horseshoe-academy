import { Hono } from 'hono';
import { createClass, assignTacherToClass, getClassesById } from '../controllers/classes.controller';

const router = new Hono();

// create a class
router.post('/', ...createClass);

// assign a teacher to a class
router.patch('/:classId', ...assignTacherToClass);

// get classes per subject
router.get('/', ...getClassesById);

export default router;