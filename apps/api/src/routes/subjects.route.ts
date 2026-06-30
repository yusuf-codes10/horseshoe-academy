import { Hono } from 'hono';
import { createSubjectForDepartment } from '../controllers/subjects.controller';

const router = new Hono();

// create a subject
router.post('/', ...createSubjectForDepartment);

export default router;