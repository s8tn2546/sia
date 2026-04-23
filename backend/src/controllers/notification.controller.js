const { asyncHandler, apiResponse } = require("../utils/helpers");
const Notification = require("../models/notification.model");

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const unreadCount = await Notification.countDocuments({ userId, read: false });

  return apiResponse(res, { notifications, unreadCount }, "Notifications fetched");
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId },
    { $set: { read: true } },
    { new: true }
  ).lean();

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found"
    });
  }

  return apiResponse(res, notification, "Notification marked as read");
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
  return apiResponse(res, { updated: true }, "All notifications marked as read");
});

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
};
