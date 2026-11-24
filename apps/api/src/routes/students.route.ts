import { Hono } from 'hono';
import { getAllStudents } from '@/controllers/students.controller';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// get all the students
router.get('/', verifyToken, ...getAllStudents);

// get teacher by id
// router.get('/:studentId', verifyToken, ...getTeacherById);

export default router;