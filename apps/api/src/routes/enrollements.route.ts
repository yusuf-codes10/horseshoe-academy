import { Hono } from 'hono';
import { acceptApplications } from '@/controllers/enrollements.controller';
import { isTeacher } from '@/middlewares/teacher';

const router = new Hono();

// post enrollemetns
router.patch('/:applicationId/accept', isTeacher, ...acceptApplications);

export default router;