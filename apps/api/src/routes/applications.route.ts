import { Hono } from 'hono';
import { createApplication } from '../controllers/applications.controller';

const router = new Hono();

// apply
router.post('/', ...createApplication);

// my applications | student

// see all applications per class | teacher

// delete my application | student

export default router;