const { asyncHandler, apiResponse } = require("../utils/helpers");
const Notification = require("../models/notification.model");

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const unreadCount = await Notification.countDocuments({ read: false });

  return apiResponse(res, { notifications, unreadCount }, "Notifications fetched");
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { $set: { read: true } },
    { new: true }
  ).lean();

  return apiResponse(res, notification, "Notification marked as read");
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ read: false }, { $set: { read: true } });
  return apiResponse(res, { updated: true }, "All notifications marked as read");
});

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
};
