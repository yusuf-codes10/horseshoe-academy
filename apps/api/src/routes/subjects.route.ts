import { Hono } from 'hono';
import { createSubjectForDepartment, getSubjectByDepId, deleteSujectById, getSubjectById } from '@/controllers/subjects.controller';

const router = new Hono();

// create a subject
router.post('/', ...createSubjectForDepartment);

// get subject by dep id
router.get('/:depId', ...getSubjectByDepId);

// get all subjects
router.get('/', )

// delete subject
router.delete('/:subjectId', ...deleteSujectById);

// get a single subject by its id
router.get('/:subjectId', ...getSubjectById);

export default router;