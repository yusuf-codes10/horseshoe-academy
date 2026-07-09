import { Hono } from 'hono';
import { createNewDepartment, getAllDeps, getDepById } from '@/controllers/departments.controller';
import { isAdmin } from '@/middlewares/admin';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// get all departements
router.get('/', ...getAllDeps);

// get dep by id
router.get('/:id', ...getDepById);

// create a departement
router.post('/', verifyToken, isAdmin, ...createNewDepartment);

export default router;