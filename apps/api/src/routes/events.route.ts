import { Hono } from 'hono';
import { sendNotification } from '@/events/notifications.event';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

router.get('/', verifyToken, ...sendNotification);

export default router;

