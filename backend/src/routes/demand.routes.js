const express = require("express");
const controller = require("../controllers/demand.controller");

const router = express.Router();

router.get("/", controller.getDemand);

module.exports = router;
