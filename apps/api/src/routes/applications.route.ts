import { Hono } from 'hono';
import { createApplication, getApplicationsPerClass } from '@/controllers/applications.controller';

const router = new Hono();

// apply
router.post('/', ...createApplication);

// my applications | student

// see all applications per class | teacher
router.get('/', ...getApplicationsPerClass);

// delete my application | student

export default router;