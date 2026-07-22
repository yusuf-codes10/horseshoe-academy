import { Hono } from "hono";
import {
  createSession,
//   getSessionPerClass,
  getSessionById,
  deleteSession,
  getAllSessions,
  getMySessions
} from "@/controllers/sessions.controller";
import { isAdmin } from "@/middlewares/admin";
import { isTeacher } from "@/middlewares/teacher";

const router = new Hono();

// create a session
router.post("/", ...createSession);

// get all sessions per class
// router.get("/", ...getSessionPerClass)

// get all sessions
router.get("/", isAdmin, ...getAllSessions);

// get my seesions
router.get("/me", isTeacher, ...getMySessions);

// get a single session by id
router.get("/:sessionId", ...getSessionById);

// delete a session
router.delete("/:sessionId", ...deleteSession);

export default router;
