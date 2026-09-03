import { Hono } from 'hono';
import { getAllTeacher, getTeacherById, assignTacherToClass } from '@/controllers/teachers.controller';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// get all the teachers
router.get('/', ...getAllTeacher);

// get teacher by id
router.get('/:teacherId', ...getTeacherById);

// assign a teacher to a class
router.patch("/:classId", verifyToken, ...assignTacherToClass);

export default router;