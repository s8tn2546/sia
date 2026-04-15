const express = require("express");
const controller = require("../controllers/delay.controller");

const router = express.Router();

router.post("/", controller.postDelayPrediction);

module.exports = router;
