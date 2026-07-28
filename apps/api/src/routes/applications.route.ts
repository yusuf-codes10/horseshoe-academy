import { Hono } from "hono";
import {
  createApplication,
  getApplicationsPerClass,
  getAllApplications,
  getApplicationById,
} from "@/controllers/applications.controller";
import { verifyToken } from "@/middlewares/verifyToken";
import { isStudent } from "@/middlewares/student";
// import { isAdmin } from '@/middlewares/admin';

const router = new Hono();

// apply
router.post("/", verifyToken, isStudent, ...createApplication);

// my applications | student

// see all applications per class | teacher
// router.get('/', ...getApplicationsPerClass);

// get all applications for the admin
router.get("/", verifyToken, ...getAllApplications);

// get application by id
router.get('/:applicationId', verifyToken, ...getApplicationById);

// delete my application | student

export default router;
