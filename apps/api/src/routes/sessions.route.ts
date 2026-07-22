import { Hono } from "hono";
import {
  createSession,
//   getSessionPerClass,
  getSessionById,
  deleteSession,
  getAllSessions,
} from "@/controllers/sessions.controller";
import { isAdmin } from "@/middlewares/admin";

const router = new Hono();

// create a session
router.post("/", ...createSession);

// get all sessions per class
// router.get("/", ...getSessionPerClass);

// get a single session by id
router.get("/:sessionId", ...getSessionById);

// get all sessions
router.get("/", isAdmin, ...getAllSessions);

// get my seesions
router.get("/me");

// delete a session
router.delete("/:sessionId", ...deleteSession);

export default router;
