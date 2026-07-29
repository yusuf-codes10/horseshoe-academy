import { Hono } from 'hono';
import { getMyNotifications, readMyNotification, deleteMyNotification } from '@/controllers/notifications.controller';

const router = new Hono();

// create a notification
router.post('/', ...getMyNotifications);

// read a notification
router.patch('/', ...readMyNotification);

// delete a notification
router.delete('/', ...deleteMyNotification);

export default router;