const express = require("express");
const controller = require("../controllers/insights.controller");

const router = express.Router();

router.get("/", controller.getInsights);

module.exports = router;
