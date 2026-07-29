import { Hono } from 'hono';
import { getMyNotifications, readMyNotification, deleteMyNotification } from '@/controllers/notifications.controller';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// create a notification
router.get('/', verifyToken, ...getMyNotifications);

// read a notification
router.patch('/', verifyToken, ...readMyNotification);

// delete a notification
router.delete('/', verifyToken, ...deleteMyNotification);

export default router;