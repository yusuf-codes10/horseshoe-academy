import { Hono } from 'hono';
import { createApplication, getApplicationsPerClass, getAllApplications } from '@/controllers/applications.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { isStudent } from '@/middlewares/student';
import { isAdmin } from '@/middlewares/admin';

const router = new Hono();

// apply
router.post('/', verifyToken, isStudent, ...createApplication);

// my applications | student

// see all applications per class | teacher
router.get('/', ...getApplicationsPerClass);

// get all applications for the admin
router.get('/admin', verifyToken, isAdmin, ...getAllApplications);

// delete my application | student

export default router;