import { Hono } from 'hono';
import { createNewDepartment, getAllDeps } from '../controllers/departments.controller';

const router = new Hono();

// get all departements
router.get('/', ...getAllDeps);

// create a departement
router.post('/', ...createNewDepartment);

export default router;