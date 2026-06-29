import { Hono } from 'hono';
import { createNewDepartment, getAllDeps } from '../controllers/departments.controller';

const router = new Hono();

// get all departements
router.get('/', ...getAllDeps);

// get dep by id
router.get('/:id');

// create a departement
router.post('/', ...createNewDepartment);

export default router;