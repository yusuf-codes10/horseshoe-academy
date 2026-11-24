import { Hono } from 'hono';
import { getAllTeacher, getTeacherById } from '@/controllers/teachers.controller';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// get all the students
router.get('/', verifyToken, ...getAllTeacher);

// get teacher by id
router.get('/:studentId', verifyToken, ...getTeacherById);

export default router;