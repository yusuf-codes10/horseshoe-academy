import { Hono } from 'hono';
import { createSubjectForDepartment } from '../controllers/subjects.controller';

const router = new Hono();

// create a subject
router.get('/', ...createSubjectForDepartment);

export default router;