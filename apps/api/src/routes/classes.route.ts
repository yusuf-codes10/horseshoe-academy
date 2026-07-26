import { Hono } from "hono";
import {
  createClass,
  assignTacherToClass,
  getClassById,
  getAllClasses,
  getMyClasses
} from "@/controllers/classes.controller";
import { verifyToken } from "@/middlewares/verifyToken";
import { isTeacher } from "@/middlewares/teacher";

const router = new Hono();

// create a class
router.post("/", ...createClass);

// get all classes
router.get("/", ...getAllClasses);

// get My Classes (teacher)
router.get('/me', verifyToken, isTeacher, ...getMyClasses);

// assign a teacher to a class
router.patch("/:classId", verifyToken, ...assignTacherToClass);

// get classes per subject
// ! ditching this one, as it intrupts the GET classes/:classId
// router.get("/:subjectId", ...getClassesBySubjectId);

// get a single class by its id
router.get("/:classId", ...getClassById);

export default router;
