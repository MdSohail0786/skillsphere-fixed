const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const query = { recipient: req.user._id };
  if (unreadOnly === 'true') query.isRead = false;
  const skip = (Number(page) - 1) * Number(limit);
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query).populate('sender', 'name avatar').sort('-createdAt').skip(skip).limit(Number(limit)),
    Notification.countDocuments(query),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);
  res.json({ success: true, message: 'Notifications', data: notifications, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit), unreadCount } });
});

const markAsRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true, readAt: new Date() });
  res.json({ success: true, message: 'Marked as read' });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true, readAt: new Date() });
  res.json({ success: true, message: 'All notifications marked as read' });
});

const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
  res.json({ success: true, message: 'Notification deleted' });
});

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
