import { Hono } from 'hono';
import { createApplication, getApplicationsPerClass } from '@/controllers/applications.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { isStudent } from '@/middlewares/student';

const router = new Hono();

// apply
router.post('/', verifyToken, isStudent, ...createApplication);

// my applications | student

// see all applications per class | teacher
router.get('/', ...getApplicationsPerClass);

// delete my application | student

export default router;