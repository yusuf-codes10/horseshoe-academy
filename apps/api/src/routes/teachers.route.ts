import { Hono } from 'hono';
import { getAllTeacher, getTeacherById } from '@/controllers/teachers.controller';

const router = new Hono();

// get all the teachers
router.get('/', ...getAllTeacher);

// get teacher by id
router.get('/:teacherId', ...getTeacherById);

export default router;