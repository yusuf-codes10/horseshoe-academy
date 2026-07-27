import { Hono } from 'hono';
import { acceptApplications } from '@/controllers/enrollements.controller';
import { isTeacher } from '@/middlewares/teacher';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// post enrollemetns
router.patch('/:applicationId/accept', verifyToken, isTeacher, ...acceptApplications);

export default router;

// TODO: fix the ux to know applied or not | and fix the increment!