const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notificationController');

router.get('/', authenticate, getNotifications);
router.patch('/read-all', authenticate, markAllAsRead);
router.patch('/:id/read', authenticate, markAsRead);
router.delete('/:id', authenticate, deleteNotification);

module.exports = router;
