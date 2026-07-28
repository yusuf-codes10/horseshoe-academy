import { Hono } from 'hono';
import { acceptApplications, rejectApplication } from '@/controllers/enrollements.controller';
import { isTeacher } from '@/middlewares/teacher';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// aceept application
router.patch('/:applicationId/accept', verifyToken, isTeacher, ...acceptApplications);

// reject application
router.patch(':/applicationId/reject', verifyToken, isTeacher, ...rejectApplication);

export default router;

// TODO: fix the ux to know applied or not | and fix the increment!