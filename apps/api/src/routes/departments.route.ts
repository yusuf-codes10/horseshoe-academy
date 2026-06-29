import { Hono } from 'hono';
import { createNewDepartment, getAllDeps, getDepById } from '../controllers/departments.controller';

const router = new Hono();

// get all departements
router.get('/', ...getAllDeps);

// get dep by id
router.get('/:id', ...getDepById);

// create a departement
router.post('/', ...createNewDepartment);

export default router;