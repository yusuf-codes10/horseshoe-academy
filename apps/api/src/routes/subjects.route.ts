import { Hono } from 'hono';
import { createSubjectForDepartment, getSubjectByDepId, deleteSujectById } from '../controllers/subjects.controller';

const router = new Hono();

// create a subject
router.post('/', ...createSubjectForDepartment);

// get subject by dep id
router.get('/', ...getSubjectByDepId);

// delete subject
router.delete('/:subjectId', ...deleteSujectById);

export default router;