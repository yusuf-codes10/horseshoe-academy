import { Hono } from 'hono';
import { getAllTeacher } from '@/controllers/teachers.controller';

const router = new Hono();

// get all the teachers
router.get('/', ...getAllTeacher);

export default router;