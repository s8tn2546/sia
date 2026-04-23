const express = require("express");
const controller = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", controller.getNotifications);
router.patch("/:id/read", controller.markNotificationRead);
router.patch("/read-all", controller.markAllNotificationsRead);

module.exports = router;
