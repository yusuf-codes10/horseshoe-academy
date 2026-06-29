import { Hono } from 'hono';
import { createNewDepartment } from '../controllers/departments.controller';

const router = new Hono();

// get all departements

// create a departement
router.post('/', ...createNewDepartment);

export default router;