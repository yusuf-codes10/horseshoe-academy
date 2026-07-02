import { Hono } from "hono";
import { registerUser, logUserIn } from '../controllers/auth.controller'

const router = new Hono();

router.post("/register", ...registerUser);

router.post("/login", ...logUserIn);

// TODO: adding both /me and /logout right here

export default router;
