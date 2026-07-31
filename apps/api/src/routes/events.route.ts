import { Hono } from 'hono';
import { sendNotification } from '@/events/notifications.event';

const router = new Hono();

router.get('/stream', ...sendNotification);

export default router;

