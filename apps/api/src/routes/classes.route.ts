import { Hono } from 'hono';
import { createClass, assignTacherToClass, getClassesById, getClassById } from '../controllers/classes.controller';

const router = new Hono();

// create a class
router.post('/', ...createClass);

// assign a teacher to a class
router.patch('/:classId', ...assignTacherToClass);

// get classes per subject
router.get('/', ...getClassesById);

// get a single class by its id
router.get('/:classId', ...getClassById);

export default router;