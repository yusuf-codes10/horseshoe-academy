import { Hono } from 'hono';
import { createClass, assignTacherToClass, getClassesBySubjectId, getClassById } from '@/controllers/classes.controller';

const router = new Hono();

// create a class
router.post('/', ...createClass);

// assign a teacher to a class
router.patch('/:classId', ...assignTacherToClass);

// get classes per subject
router.get('/', ...getClassesBySubjectId);

// get a single class by its id
router.get('/:classId', ...getClassById);

// get all classes
// router.get('/')

export default router;