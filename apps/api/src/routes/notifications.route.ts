import { Hono } from 'hono';
import { getMyNotifications, readMyNotification, deleteMyNotification } from '@/controllers/notifications.controller';
import { verifyToken } from '@/middlewares/verifyToken';

const router = new Hono();

// all shoud use auth middleware
router.use('*', verifyToken);

// create a notification
router.get('/', ...getMyNotifications);

// read a notification
router.patch('/:notificationId', ...readMyNotification);

// delete a notification
router.delete('/:notificationId', ...deleteMyNotification);

export default router;