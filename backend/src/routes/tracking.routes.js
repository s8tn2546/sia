const express = require("express");
const controller = require("../controllers/tracking.controller");

const router = express.Router();

router.get("/:id", controller.getTracking);

module.exports = router;
