import { Hono } from "hono";
import { registerUser, logUserIn, verifyUser } from '../controllers/auth.controller'
import { verifyToken } from "../middlewares/verifyToken";

const router = new Hono();

router.post("/register", ...registerUser);

router.post("/login", ...logUserIn);

// TODO: adding both /me and /logout right here
router.get('/me', verifyToken, ...verifyUser);

router.post('/logout');

export default router;
