import { Hono } from "hono";
import {
  acceptApplications,
  rejectApplication,
  getEnrolledStudentsPerClass,
  getMyEnrollements
} from "@/controllers/enrollements.controller";
import { isTeacher } from "@/middlewares/teacher";
import { verifyToken } from "@/middlewares/verifyToken";
import { isStudent } from "@/middlewares/student";

const router = new Hono();

// aceept application
router.patch(
  "/:applicationId/accept",
  verifyToken,
  isTeacher,
  ...acceptApplications,
);

// reject application
router.patch(
  "/:applicationId/reject",
  verifyToken,
  isTeacher,
  ...rejectApplication,
);

// get enrolled Students | enrollements join | students enrolled for this class
router.get("/:classId", ...getEnrolledStudentsPerClass);

router.get('/me', verifyToken, isStudent, ...getMyEnrollements);

export default router;

// TODO: fix the ux to know applied or not | and fix the increment!
